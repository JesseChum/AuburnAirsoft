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

    const existingPdfBytes = fs.readFileSync(waiverPath)
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    const pages = pdfDoc.getPages()
    if (pages.length < 3) {
      throw new Error("Expected 3 pages in waiver PDF")
    }

    //PAGE 3 — ACKNOWLEDGMENT & SIGNATURE
    const page = pages[2]
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

    // ---------------------------
    // PAGE 3 FIELD COORDINATES
    // ---------------------------
    const x = 230

    // These Y values are aligned to the actual underline positions
const yParticipant = 570
const yDob = 540
const ySignature = 510
const yEmergency = 480
const yDateSigned = 450

draw(name, x, yParticipant)                       // Participant Name
draw(dob, x, yDob)                                // Date of Birth
draw(name, x, ySignature)                         // Signature (typed name)
draw(`${emergencyName} - ${emergencyPhone}`, x, yEmergency)
draw(new Date().toLocaleDateString(), x, yDateSigned)

// Parent / Guardian (MINORS)
if (parentName) {
  const yParentName = 370
  const yParentSignature = 340
  const yParentDate = 310

  draw(parentName, x, yParentName)
  draw(parentName, x, yParentSignature)
  draw(new Date().toLocaleDateString(), x, yParentDate)
    }

    const outputBytes = await pdfDoc.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Auburn-Airsoft-Waiver.pdf"'
    )

    return res.status(200).send(Buffer.from(outputBytes))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("WAIVER API ERROR:", err)

    return res.status(500).json({
      error: "Waiver generation failed",
      message,
    })
  }
}
