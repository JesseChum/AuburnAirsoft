import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const HANDLER_VERSION = "submit-waiver v3 SHIFT_TEST 2025-12-31"

// BIG shifts so you can’t miss the movement
const SHIFT_X = 200
const SHIFT_Y = -80

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", HANDLER_VERSION })
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
      return res.status(400).json({ error: "Missing required fields", HANDLER_VERSION })
    }

    // determine minor
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    const isMinor = age < 18

    console.log("HANDLER_VERSION:", HANDLER_VERSION)
    console.log("SHIFT_X:", SHIFT_X, "SHIFT_Y:", SHIFT_Y)
    console.log("DOB:", dob, "age:", age, "isMinor:", isMinor, "parentName:", parentName)

    // Load your PDF
    const pdfPath = path.join(process.cwd(), "public", "AuburnAirsoftWaiver.pdf")
    const pdfBytes = fs.readFileSync(pdfPath)

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    const page = pages[2]

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    // HUGE debug stamp so you can confirm this code ran
    page.drawText(HANDLER_VERSION, { x: 50, y: 740, size: 18, font, color: black })

    const draw = (text: string, x: number, y: number) => {
      page.drawText(String(text), {
        x: x + SHIFT_X,
        y: y + SHIFT_Y,
        size: 12,
        font,
        color: black,
      })
    }

    // Base coords (we’ll calibrate once we confirm code is running)
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

    if (isMinor && parentName && parentName.trim() !== "") {
      const yParentName = 327
      const yParentSignature = 305
      const yParentDate = 277

      draw(parentName, x, yParentName)
      draw(parentName, x, yParentSignature)
      draw(new Date().toLocaleDateString(), x, yParentDate)
    }

    const finalPdf = await pdfDoc.save()
    const fileName = `waiver-${Date.now()}.pdf`

    const { error } = await supabase.storage
      .from("waivers")
      .upload(fileName, finalPdf, { contentType: "application/pdf" })

    if (error) throw error

    return res.status(200).json({
      success: true,
      fileName,
      debug: { HANDLER_VERSION, SHIFT_X, SHIFT_Y, isMinor, parentName: parentName ?? null },
    })
  } catch (err) {
    console.error("WAIVER ERROR:", err)
    return res.status(500).json({ error: "Waiver generation failed", HANDLER_VERSION })
  }
}
