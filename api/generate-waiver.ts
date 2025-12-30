import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
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

  const waiverPath = path.join(
    process.cwd(),
    "public/assets/AuburnAirsoftWaiver.pdf"
  )

  const pdfBytes = fs.readFileSync(waiverPath)
  const pdfDoc = await PDFDocument.load(pdfBytes)

  const page = pdfDoc.getPages()[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText(name, { x: 170, y: 540, size: 12, font, color: rgb(0, 0, 0) })
  page.drawText(dob, { x: 170, y: 515, size: 12, font })
  page.drawText(emergencyName, { x: 170, y: 490, size: 12, font })
  page.drawText(emergencyPhone, { x: 170, y: 465, size: 12, font })

  if (parentName) {
    page.drawText(parentName, { x: 170, y: 440, size: 12, font })
  }

  const signedPdf = await pdfDoc.save()

  res.setHeader("Content-Type", "application/pdf")
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Auburn-Airsoft-Waiver.pdf"'
  )

  return res.send(Buffer.from(signedPdf))
}
