import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

export const config = {
  runtime: "nodejs",
}

// Supabase SERVER client (service role)
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
      return res.status(405).send("POST only")
    }

    const {
      name,
      dob,
      emergencyName,
      emergencyPhone,
      parentName,
      minor,
    } = req.body

    // ============================
    // LOAD BASE PDF
    // ============================
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(pdfPath)) {
      throw new Error("Base waiver PDF not found")
    }

    const baseBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(baseBytes)

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)
    const red = rgb(1, 0, 0)

    const pages = pdfDoc.getPages()

    // ============================
    // DEBUG MARKERS (REMOVE LATER)
    // ============================
    pages.forEach((p, i) => {
      p.drawText(`PAGE ${i}`, {
        x: 20,
        y: 20,
        size: 14,
        font,
        color: red,
      })
    })

    // ============================
    // SIGNATURE PAGE (PAGE 3)
    // ============================
    const page = pages[2]
    page.setRotation(degrees(0))

    const draw = (text: string, x: number, y: number) => {
      page.drawText(text ?? "", {
        x,
        y,
        size: 11,
        font,
        color: black,
      })
    }

    // === FIELD COORDINATES ===
    draw(name, 230, 560)
    draw(dob, 230, 535)
    draw(name, 230, 510)
    draw(`${emergencyName} - ${emergencyPhone}`, 230, 485)
    draw(new Date().toLocaleDateString(), 230, 460)

    if (minor && parentName) {
      draw(parentName, 230, 330)
      draw(parentName, 230, 305)
      draw(new Date().toLocaleDateString(), 230, 280)
    }

    // ============================
    // FINAL PDF BYTES (ONCE)
    // ============================
    const finalPdfBytes = await pdfDoc.save()

    // ============================
    // UPLOAD TO SUPABASE (STORAGE ONLY)
    // ============================
    const filename = `waiver-${Date.now()}.pdf`

    const { error } = await supabase.storage
      .from("waivers")
      .upload(filename, finalPdfBytes, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (error) {
      throw new Error("Supabase upload failed: " + error.message)
    }

    // ============================
    // RETURN PDF TO CLIENT
    // ============================
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    )

    return res.status(200).send(Buffer.from(finalPdfBytes))
  } catch (err) {
    console.error("WAIVER ERROR:", err)
    return res.status(500).send("Waiver generation failed")
  }
}
