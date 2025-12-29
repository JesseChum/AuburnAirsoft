import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts } from "pdf-lib"

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

  // Create PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const { height } = page.getSize()
  let y = height - 50

  const draw = (text: string) => {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font,
    })
    y -= 20
  }

  draw("AUBURN AIRSOFT COMMUNITY FIELD")
  draw("")
  draw(`Participant Name: ${name}`)
  draw(`Date of Birth: ${dob}`)
  draw(`Emergency Contact: ${emergencyName}`)
  draw(`Emergency Phone: ${emergencyPhone}`)

  if (parentName) {
    draw("")
    draw(`Parent / Guardian Name: ${parentName}`)
  }

  draw("")
  draw(`Signed On: ${new Date().toLocaleDateString()}`)
  draw("")
  draw("I acknowledge and agree to the terms of the waiver.")

  const pdfBytes = await pdfDoc.save()

  // IMPORTANT HEADERS
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Auburn-Airsoft-Waiver.pdf"'
  )

  return res.send(Buffer.from(pdfBytes))
}
