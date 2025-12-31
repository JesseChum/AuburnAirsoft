import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"

export const config = {
  runtime: "nodejs",
}

type WaiverBody = {
  name: string
  dob: string
  emergencyName: string
  emergencyPhone: string
  minor?: boolean
  parentName?: string | null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const body = req.body as Partial<WaiverBody>

    const name = body.name?.trim()
    const dob = body.dob?.trim()
    const emergencyName = body.emergencyName?.trim()
    const emergencyPhone = body.emergencyPhone?.trim()
    const minor = Boolean(body.minor)
    const parentName = body.parentName?.trim() || ""

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Load base PDF from /public (keep your filename)
    const pdfPath = path.join(process.cwd(), "public", "AuburnAirsoftWaiver.pdf")
    const existingPdfBytes = fs.readFileSync(pdfPath)

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()
    if (pages.length < 3) throw new Error("Expected 3 pages in waiver PDF")

    const page = pages[2] // Page 3
    const { height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    // ---- Helpers ----
    const SHIFT_X = 0 // increase to move EVERYTHING right, e.g. 15 or 25
    const FONT_SIZE = 12

    // Draw using coordinates measured from TOP of the page
    const drawTop = (text: string, x: number, yFromTop: number) => {
      page.drawText(String(text), {
        x: x + SHIFT_X,
        y: height - yFromTop,
        size: FONT_SIZE,
        font,
        color: black,
      })
    }

    const today = new Date().toLocaleDateString()

    // --------------------------------------------------
    // PAGE 3 – TUNE THESE "FROM TOP" VALUES
    // --------------------------------------------------
    // These are starting points that should actually MOVE now.
    // If you want it slightly higher/lower, adjust yFromTop numbers.
    const X_LINE_START = 255

    // Main fields (from top)
    drawTop(name, X_LINE_START, 165) // Participant Name line
    drawTop(dob, X_LINE_START, 190) // DOB line
    drawTop(name, X_LINE_START, 215) // Signature line

    // Emergency contact line: name - phone
    drawTop(`${emergencyName} - ${emergencyPhone}`, X_LINE_START + 55, 240)

    // Date signed line
    drawTop(today, X_LINE_START, 265)

    // Parent section (only if minor + parentName provided)
    if (minor && parentName) {
      drawTop(parentName, X_LINE_START, 455) // Parent/Guardian Name
      drawTop(parentName, X_LINE_START, 480) // Parent Signature
      drawTop(today, X_LINE_START, 505) // Parent Date Signed
    }

    const outputBytes = await pdfDoc.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="Auburn-Airsoft-Waiver.pdf"')
    return res.status(200).send(Buffer.from(outputBytes))
  } catch (err) {
    console.error("WAIVER API ERROR:", err)
    return res.status(500).json({ error: "Waiver generation failed" })
  }
}
