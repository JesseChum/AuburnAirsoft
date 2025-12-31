import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
      isMinor,
    }: {
      name: string
      dob: string
      emergencyName: string
      emergencyPhone: string
      parentName?: string
      isMinor: boolean
    } = req.body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // ---- Load PDF ----
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "AuburnAirsoftWaiver.pdf"
    )

    const pdfBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)

    const pages = pdfDoc.getPages()
    if (pages.length < 3) {
      throw new Error("Expected waiver PDF to have at least 3 pages")
    }

    const page = pages[2] // PAGE 3
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
    // PAGE 3 COORDINATES (RESTORED)
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

    // ---- Parent / Guardian (MINORS) ----
    if (isMinor && parentName) {
      const yParentName = 327
      const yParentSignature = 305
      const yParentDate = 277

      draw(parentName, x, yParentName)
      draw(parentName, x, yParentSignature)
      draw(new Date().toLocaleDateString(), x, yParentDate)
    }

    // ---- Save PDF ----
    const finalPdf = await pdfDoc.save()
    const fileName = `waiver-${Date.now()}.pdf`

    // ---- Upload to Supabase Storage ----
    const { error: uploadError } = await supabase.storage
      .from("waivers")
      .upload(fileName, finalPdf, {
        contentType: "application/pdf",
      })

    if (uploadError) throw uploadError

    // ---- Insert DB Record ----
    await supabase.from("waivers").insert({
      participant_name: name,
      date_of_birth: dob,
      emergency_contact: `${emergencyName} - ${emergencyPhone}`,
      parent_name: isMinor ? parentName : null,
      pdf_path: fileName,
      signed_at: new Date().toISOString(),
    })

    return res.status(200).json({ success: true, fileName })
  } catch (err) {
    console.error("WAIVER ERROR:", err)
    return res.status(500).json({ error: "Waiver generation failed" })
  }
}
