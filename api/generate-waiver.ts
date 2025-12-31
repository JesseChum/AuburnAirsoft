import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"

export const config = {
  runtime: "nodejs",
}

// Create Supabase client ONLY if env vars exist
function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      `Missing env vars. SUPABASE_URL=${url ? "OK" : "MISSING"}, SUPABASE_SERVICE_ROLE_KEY=${
        key ? "OK" : "MISSING"
      }`
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const { name, dob, emergencyName, emergencyPhone, parentName } = req.body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // ---------------------------
    // Load waiver template by fetching from your deployed site
    // ---------------------------
    const proto =
      (req.headers["x-forwarded-proto"] as string) ||
      (req.headers["x-forwarded-protocol"] as string) ||
      "https"
    const host = req.headers.host

    if (!host) throw new Error("Missing Host header")

    const templateUrl = `${proto}://${host}/AuburnAirsoftWaiver.pdf`

    const templateRes = await fetch(templateUrl)
    if (!templateRes.ok) {
      throw new Error(
        `Failed to fetch template PDF (${templateRes.status}). URL=${templateUrl}`
      )
    }

    const templateBytes = new Uint8Array(await templateRes.arrayBuffer())
    const pdfDoc = await PDFDocument.load(templateBytes)

    const pages = pdfDoc.getPages()
    if (pages.length < 3) {
      throw new Error(`Expected 3 pages in waiver PDF, got ${pages.length}`)
    }

    // ---------------------------
    // Draw fields on Page 3
    // ---------------------------
    const page = pages[2]
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const draw = (text: string, x: number, y: number) => {
      page.drawText(String(text), {
        x,
        y,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      })
    }

    const x = 230
    draw(name, x, 570)
    draw(dob, x, 545)
    draw(name, x, 520)
    draw(`${emergencyName} - ${emergencyPhone}`, x + 47, 498)
    draw(new Date().toLocaleDateString(), x, 470)

    if (parentName) {
      draw(parentName, x, 329)
      draw(parentName, x, 305)
      draw(new Date().toLocaleDateString(), x, 277)
    }

    const pdfBytes = await pdfDoc.save()

    // ---------------------------
    // Upload to Supabase Storage
    // ---------------------------
    const supabase = getSupabase()

    const safeName = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const fileName = `${safeName}-${Date.now()}.pdf` // ✅ no "waivers/" prefix here

    const { error: uploadError } = await supabase.storage
      .from("waivers")
      .upload(fileName, Buffer.from(pdfBytes), {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("SUPABASE UPLOAD ERROR:", uploadError)
      throw new Error(`Supabase upload failed: ${uploadError.message}`)
    }

    return res.status(200).json({
      success: true,
      file: fileName,
    })
  } catch (err) {
    console.error("WAIVER API ERROR:", err)
    const message = err instanceof Error ? err.message : String(err)
    return res.status(500).json({ error: "Failed to submit waiver", message })
  }
}
