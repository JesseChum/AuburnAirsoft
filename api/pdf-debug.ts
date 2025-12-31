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
    console.log("PDF DEBUG ROUTE HIT")

    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).send("BASE PDF NOT FOUND")
    }

    const baseBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(baseBytes)

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const red = rgb(1, 0, 0)

    const pages = pdfDoc.getPages()

    // EXTREME, IMPOSSIBLE-TO-MISS MARKERS
    pages[0].drawText("VERCEL PDF DEBUG — PAGE 0", {
      x: 40,
      y: pages[0].getHeight() - 40,
      size: 30,
      font,
      color: red,
    })

    pages[1].drawText("VERCEL PDF DEBUG — PAGE 1", {
      x: 150,
      y: 400,
      size: 30,
      font,
      color: red,
    })

    pages[2].drawText("VERCEL PDF DEBUG — PAGE 2", {
      x: pages[2].getWidth() - 520,
      y: 60,
      size: 30,
      font,
      color: red,
    })

    const outputBytes = await pdfDoc.save()

    // DO NOT UPLOAD, DO NOT MODIFY, DO NOT TOUCH SUPABASE
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      'inline; filename="VERCEL_PDF_DEBUG.pdf"'
    )

    return res.status(200).send(Buffer.from(outputBytes))
  } catch (err) {
    console.error("PDF DEBUG FAILED:", err)
    return res.status(500).send("DEBUG FAILED")
  }
}
