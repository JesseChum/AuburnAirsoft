import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// -----------------------------
// SUPABASE (SERVER ONLY)
// -----------------------------
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// -----------------------------
// GLOBAL POSITION ADJUSTMENTS
// -----------------------------
// 👉 Increase SHIFT_X to move RIGHT
// 👉 Decrease SHIFT_Y to move DOWN
const SHIFT_X = 45
const SHIFT_Y = -10

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
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

    // -----------------------------
    // DETERMINE AGE (SERVER TRUTH)
    // -----------------------------
    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    const isMinor = age < 18

    console.log("DOB:", dob)
    console.log("Computed age:", age)
    console.log("isMinor:", isMinor)
    console.log("parentName:", parentName)

    // -----------------------------
    // LOAD BASE PDF
    // -----------------------------
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    const pdfBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)

    const pages = pdfDoc.getPages()
    console.log("Total pages:", pages.length)

    const page = pages[2] // ACKNOWLEDGMENT & SIGNATURE PAGE
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    const draw = (text: string, x: number, y: number) => {
      page.drawText(String(text), {
        x: x + SHIFT_X,
        y: y + SHIFT_Y,
        size: 12,
        font,
        color: black,
      })
    }

    // -----------------------------
    // FIELD COORDINATES (BASE)
    // -----------------------------
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

    // -----------------------------
    // PARENT / GUARDIAN (MINORS)
    // -----------------------------
    if (isMinor && parentName && parentName.trim() !== "") {
      const yParentName = 327
      const yParentSignature = 305
      const yParentDate = 277

      draw(parentName, x, yParentName)
      draw(parentName, x, yParentSignature)
      draw(new Date().toLocaleDateString(), x, yParentDate)
    }

    // -----------------------------
    // SAVE & UPLOAD
    // -----------------------------
    const finalPdf = await pdfDoc.save()
    const fileName = `waiver-${Date.now()}.pdf`

    const { error } = await supabase.storage
      .from("waivers")
      .upload(fileName, finalPdf, {
        contentType: "application/pdf",
      })

    if (error) throw error

    return res.status(200).json({
      success: true,
      fileName,
      debug: {
        isMinor,
        parentName: parentName ?? null,
        dob,
      },
    })
  } catch (err) {
    console.error("WAIVER ERROR:", err)
    return res.status(500).json({
      error: "Waiver generation failed",
    })
  }
}
