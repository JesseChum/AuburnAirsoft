import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"
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
    //  HARD PROOF THIS FILE IS RUNNING
    console.log("submit-waiver.ts IS RUNNING")

    if (req.method !== "POST") {
      return res.status(405).send("POST only")
    }

    const {
      name = "TEST NAME",
      dob = "2000-01-01",
      emergencyName = "TEST EMERGENCY",
      emergencyPhone = "0000000000",
      parentName = "TEST PARENT",
      minor = true,
    } = req.body || {}

    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    if (!fs.existsSync(pdfPath)) {
      throw new Error(" PDF NOT FOUND at /public/AuburnAirsoftWaiver.pdf")
    }

    const pdfBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)
    const red = rgb(1, 0, 0)

    const pages = pdfDoc.getPages()

    // LABEL EVERY PAGE (YOU MUST SEE THIS)
    pages.forEach((page, i) => {
      page.drawText(`PAGE INDEX ${i}`, {
        x: 30,
        y: 30,
        size: 16,
        font,
        color: red,
      })
    })

    // USE PAGE 3 (index 2)
    const page = pages[2]
    page.setRotation(degrees(0))

    const height = page.getHeight()
    const width = page.getWidth()

    // EXTREME CORNER TESTS
    page.drawText("TOP LEFT", {
      x: 20,
      y: height - 40,
      size: 20,
      font,
      color: red,
    })

    page.drawText("BOTTOM RIGHT", {
      x: width - 260,
      y: 40,
      size: 20,
      font,
      color: red,
    })

    // ============================
    // FIELD PLACEMENT TEST
    // ============================
    const x = 220

    const draw = (text: string, y: number) => {
      page.drawText(String(text), {
        x,
        y,
        size: 12,
        font,
        color: black,
      })
    }

    draw(name, 560)
    draw(dob, 535)
    draw(`${emergencyName} - ${emergencyPhone}`, 510)
    draw(new Date().toLocaleDateString(), 485)

    if (minor) {
      draw(parentName, 330)
      draw(parentName, 305)
      draw(new Date().toLocaleDateString(), 280)
    }

    const output = await pdfDoc.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="TEST-WAIVER.pdf"'
    )

    return res.status(200).send(Buffer.from(output))
  } catch (err) {
    console.error("WAIVER ERROR:", err)
    return res.status(500).send(String(err))
  }
}
