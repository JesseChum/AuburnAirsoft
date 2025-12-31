import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"

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
    } = req.body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Load base PDF
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    const pdfBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)

    const pages = pdfDoc.getPages()
    if (pages.length < 3) {
      throw new Error("Expected 3 pages in waiver PDF")
    }

    const page = pages[2] // PAGE 3
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    const draw = (text: string, x: number, y: number) => {
      page.drawText(String(text), {
        x,
        y,
        size: 12,
        font,
        color: black,
      })
    }

    // --------------------------------------------------
    // PAGE 3 – VERIFIED COORDINATES (SHIFTED RIGHT)
    // --------------------------------------------------

    const x = 255 // shifted right to sit ON the line

    draw(name, x, 570)                         // Participant Name
    draw(dob, x, 545)                          // Date of Birth
    draw(name, x, 520)                         // Signature (typed)
    draw(
      `${emergencyName} - ${emergencyPhone}`,
      x + 55,
      498
    )
    draw(new Date().toLocaleDateString(), x, 470)

    // --------------------------------------------------
    // PARENT / GUARDIAN (MINORS)
    // --------------------------------------------------
    if (parentName) {
      draw(parentName, x, 327)                 // Parent Name
      draw(parentName, x, 305)                 // Parent Signature
      draw(new Date().toLocaleDateString(), x, 277)
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
    return res.status(500).json({ error: "Waiver generation failed" })
  }
}
