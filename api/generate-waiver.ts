import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// --------------------------------------------------
// ENV CHECK (leave this in until everything works)
// --------------------------------------------------
console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING"
)

// --------------------------------------------------
// Supabase server client (SERVICE ROLE — backend only)
// --------------------------------------------------
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
)

// --------------------------------------------------
// Vercel Serverless Function
// --------------------------------------------------
export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405 }
      )
    }

    const body = await req.json()
    const {
      name,
      dob,
      emergencyName,
      emergencyPhone,
      parentName,
    } = body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      )
    }

    // --------------------------------------------------
    // Load waiver template from /public
    // --------------------------------------------------
    const waiverPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(waiverPath)) {
      throw new Error("Waiver template PDF not found")
    }

    const existingPdfBytes = fs.readFileSync(waiverPath)
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    const pages = pdfDoc.getPages()
    if (pages.length < 3) {
      throw new Error("Expected 3 pages in waiver PDF")
    }

    // --------------------------------------------------
    // PAGE 3 — SIGNATURE PAGE
    // --------------------------------------------------
    const page = pages[2]
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    const draw = (text: string, x: number, y: number) => {
      page.drawText(String(text), {
        x,
        y,
        size: 11,
        font,
        color: black,
      })
    }

    const x = 230

    draw(name, x, 570) // Participant Name
    draw(dob, x, 545) // DOB
    draw(name, x, 520) // Signature
    draw(`${emergencyName} - ${emergencyPhone}`, x + 47, 498)
    draw(new Date().toLocaleDateString(), x, 470)

    if (parentName) {
      draw(parentName, x, 329)
      draw(parentName, x, 305)
      draw(new Date().toLocaleDateString(), x, 277)
    }

    const outputBytes = await pdfDoc.save()

    // --------------------------------------------------
    // Upload to Supabase Storage
    // --------------------------------------------------
    const safeName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const fileName = `${safeName}-${Date.now()}.pdf`

    console.log("Uploading waiver:", fileName)

    const { error: uploadError } = await supabase.storage
      .from("waivers")
      .upload(fileName, outputBytes, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      throw uploadError
    }

    console.log("Upload successful")

    // --------------------------------------------------
    // SUCCESS RESPONSE (NO DOWNLOAD)
    // --------------------------------------------------
    return new Response(
      JSON.stringify({
        success: true,
        file: fileName,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (err) {
    console.error("WAIVER FUNCTION ERROR:", err)

    return new Response(
      JSON.stringify({
        error: "Waiver generation failed",
        message: err instanceof Error ? err.message : String(err),
      }),
      { status: 500 }
    )
  }
}
