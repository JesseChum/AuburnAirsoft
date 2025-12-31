import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"
import { degrees } from "pdf-lib"

export const config = {
  runtime: "nodejs",
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const {
      name,
      dob,
      emergencyName,
      emergencyPhone,
      parentName,
      minor,
    } = req.body

    // HARD FAIL if this file is not the one running
    console.log(" submit-waiver.ts RUNNING")

    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF NOT FOUND AT /public/AuburnAirsoftWaiver.pdf")
    }

    const existingPdfBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)
    const red = rgb(1, 0, 0)

    const pages = pdfDoc.getPages()

    // LABEL EVERY PAGE (PROVES PAGE INDEX)
    pages.forEach((p, i) => {
      p.drawText(`PAGE INDEX ${i}`, {
        x: 40,
        y: 40,
        size: 16,
        font,
        color: red,
      })
    })

    // USE PAGE INDEX 2 (3rd page)
    const page = pages[2]

    // FORCE ROTATION RESET
   page.setRotation(degrees(0))

    const pageHeight = page.getHeight()

    //  PROOF TEXT — SHOULD APPEAR TOP LEFT
    page.drawText(" TOP LEFT TEST", {
      x: 50,
      y: pageHeight - 50,
      size: 20,
      font,
      color: red,
    })

    //  PROOF TEXT — SHOULD APPEAR BOTTOM RIGHT
    page.drawText("BOTTOM RIGHT TEST", {
      x: page.getWidth() - 300,
      y: 50,
      size: 20,
      font,
      color: red,
    })

    // ==============================
    // REAL FIELD COORDINATES
    // ==============================
    const x = 230

    const draw = (text: string, y: number) => {
      page.drawText(String(text), {
        x,
        y,
        size: 12,
        font,
        color: black,
      })
    }

    // THESE VALUES WILL NOW MOVE — GUARANTEED
    draw(name, 570)                         // Participant Name
    draw(dob, 545)                          // DOB
    draw(name, 520)                         // Signature
    draw(`${emergencyName} - ${emergencyPhone}`, 495)
    draw(new Date().toLocaleDateString(), 470)

    // ==============================
    // PARENT / GUARDIAN (MINORS)
    // ==============================
    if (minor && parentName) {
      draw(parentName, 325)                 // Parent Name
      draw(parentName, 305)                 // Parent Signature
      draw(new Date().toLocaleDateString(), 280)
    } else {
      page.drawText("NO PARENT DATA RENDERED", {
        x: 50,
        y: 300,
        size: 14,
        font,
        color: red,
      })
    }

    const outputBytes = await pdfDoc.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Auburn-Airsoft-Waiver.pdf"'
    )

    return res.status(200).send(Buffer.from(outputBytes))
  } catch (err) {
    console.error("WAIVER API ERROR:", err)
    return res.status(500).json({
      error: "Waiver generation failed",
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
