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
    // ============================
    // HARD STOP TEST
    // ============================
    if (req.method !== "POST") {
      return res.status(405).send("POST only")
    }

    console.log("DEBUG ROUTE HIT")

    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).send("PDF NOT FOUND")
    }

    const originalBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(originalBytes)

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const red = rgb(1, 0, 0)

    const pages = pdfDoc.getPages()

    // ============================
    // ABSOLUTE VISUAL MARKERS
    // ============================

    // Page 0
    pages[0].drawText("PAGE 0 — TOP LEFT", {
      x: 50,
      y: pages[0].getHeight() - 50,
      size: 30,
      font,
      color: red,
    })

    // Page 1
    pages[1].drawText("PAGE 1 — CENTER", {
      x: 200,
      y: 400,
      size: 30,
      font,
      color: red,
    })

    // Page 2
    pages[2].drawText("PAGE 2 — BOTTOM RIGHT", {
      x: pages[2].getWidth() - 400,
      y: 50,
      size: 30,
      font,
      color: red,
    })

    const outputBytes = await pdfDoc.save()

    // ============================
    // SEND MODIFIED PDF ONLY
    // ============================
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="DEBUG-WAIVER.pdf"'
    )

    return res.status(200).send(Buffer.from(outputBytes))
  } catch (err) {
    console.error("DEBUG ERROR:", err)
    return res.status(500).send("DEBUG FAILED")
  }
}
