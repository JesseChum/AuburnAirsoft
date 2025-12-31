import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// ENV CHECK
console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING"
)

// Supabase server client (SERVICE ROLE)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const { name, dob, emergencyName, emergencyPhone, parentName } = req.body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Load PDF
    const waiverPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(waiverPath)) {
      throw new Error("Waiver template PDF not found")
    }

    const pdfDoc = await PDFDocument.load(fs.readFileSync(waiverPath))
    const page = pdfDoc.getPages()[2]

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    const draw = (text: string, x: number, y: number) => {
      page.drawText(String(text), { x, y, size: 11, font, color: black })
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

    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const fileName = `${safeName}-${Date.now()}.pdf`

    const { error } = await supabase.storage
      .from("waivers")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
      })

    if (error) throw error

    return res.status(200).json({ success: true, file: fileName })
  } catch (err) {
    console.error("WAIVER ERROR:", err)
    return res.status(500).json({
      error: "Waiver generation failed",
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
