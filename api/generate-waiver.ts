import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"

export const config = {
  runtime: "nodejs",
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

    const waiverPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(waiverPath)) {
      throw new Error(`Waiver PDF not found at ${waiverPath}`)
    }

    const existingPdfBytes = fs.readFileSync(waiverPath)
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    const page = pdfDoc.getPages()[0]
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    page.drawText(String(name), { x: 170, y: 540, size: 12, font, color: rgb(0,0,0) })
    page.drawText(String(dob), { x: 170, y: 520, size: 12, font })
    page.drawText(String(emergencyName), { x: 170, y: 500, size: 12, font })
    page.drawText(String(emergencyPhone), { x: 170, y: 480, size: 12, font })

    if (parentName) {
      page.drawText(String(parentName), { x: 170, y: 460, size: 12, font })
    }

    const outputBytes = await pdfDoc.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Auburn-Airsoft-Waiver.pdf"'
    )

    return res.status(200).send(Buffer.from(outputBytes))
  } catch (err: unknown) {
  if (err instanceof Error) {
    console.error("WAIVER API ERROR:", err.message)
    return res.status(500).json({
      error: "Waiver generation failed",
      message: err.message,
      stack: err.stack,
    })
  }

  console.error("WAIVER API ERROR:", err)

  return res.status(500).json({
    error: "Waiver generation failed",
    message: "Unknown error",
   })
  }
}
