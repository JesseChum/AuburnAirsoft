import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL)
console.log(
  "SERVICE ROLE exists:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Supabase admin client (server-only)
 */
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

/**
 * POST /api/submit-waiver
 */
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
    }: {
      name: string
      dob: string
      emergencyName: string
      emergencyPhone: string
    } = req.body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    /**
     * Load base PDF from /public
     */
    const pdfPath = path.join(process.cwd(), "public", "waiver.pdf")
    const basePdf = fs.readFileSync(pdfPath)

    const pdfDoc = await PDFDocument.load(basePdf)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Page 3 (0-based index)
    const pages = pdfDoc.getPages()
    const page = pages[2]

    /**
     * Draw user data onto PDF
     */
    page.drawText(name, { x: 100, y: 500, size: 12, font })
    page.drawText(dob, { x: 100, y: 480, size: 12, font })
    page.drawText(emergencyName, { x: 100, y: 460, size: 12, font })
    page.drawText(emergencyPhone, { x: 100, y: 440, size: 12, font })

    /**
     * Save PDF
     */
    const finalPdfBytes = await pdfDoc.save()

    const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
    const fileName = `waiver-${safeName}-${Date.now()}.pdf`

    /**
     * Upload to Supabase Storage
     */
    const { error: uploadError } = await supabase.storage
      .from("waivers")
      .upload(fileName, finalPdfBytes, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    /**
     * Insert DB record (AFTER upload succeeds)
     */
    await supabase.from("waivers").insert({
      participant_name: name,
      date_of_birth: dob,
      is_minor: false,
      pdf_path: fileName,
    })

    return res.status(200).json({
      success: true,
      fileName,
    })
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
      return res.status(500).json({ error: err.message })
    }

    return res.status(500).json({ error: "Unknown server error" })
  }
}
