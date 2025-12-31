import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

/**
 * Supabase admin client (server-only)
 */
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

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
    }: {
      name: string
      dob: string
      emergencyName: string
      emergencyPhone: string
      parentName?: string
    } = req.body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // ---------------------------
    // Determine minor status
    // ---------------------------
    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    const isMinor = age < 18

    // ---------------------------
    // Load base waiver PDF
    // ---------------------------
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

    // PAGE 3 — ACKNOWLEDGMENT & SIGNATURE
    const page = pages[2]
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    const draw = (text: string, x: number, y: number) => {
      page.drawText(text, {
        x,
        y,
        size: 12,
        font,
        color: black,
      })
    }

    // ---------------------------
    // FIELD COORDINATES (PROVEN)
    // ---------------------------
    const x = 230

    const yParticipant = 570
    const yDob = 545
    const ySignature = 520
    const yEmergency = 498
    const yDateSigned = 470

    draw(name, x, yParticipant)
    draw(dob, x, yDob)
    draw(name, x, ySignature)
    draw(`${emergencyName} - ${emergencyPhone}`, x + 47, yEmergency)
    draw(new Date().toLocaleDateString(), x, yDateSigned)

    // ---------------------------
    // Parent / Guardian (MINORS)
    // ---------------------------
    if (isMinor && parentName) {
      const yParentName = 327
      const yParentSignature = 305
      const yParentDate = 277

      draw(parentName, x, yParentName)
      draw(parentName, x, yParentSignature)
      draw(new Date().toLocaleDateString(), x, yParentDate)
    }

    // ---------------------------
    // Save & upload PDF
    // ---------------------------
    const outputBytes = await pdfDoc.save()
    const fileName = `waiver-${Date.now()}.pdf`

    const { error } = await supabase.storage
      .from("waivers")
      .upload(fileName, outputBytes, {
        contentType: "application/pdf",
      })

    if (error) throw error

    return res.status(200).json({
      success: true,
      fileName,
    })
  } catch (err) {
    console.error("WAIVER API ERROR:", err)
    return res.status(500).json({
      error: "Waiver generation failed",
    })
  }
}
