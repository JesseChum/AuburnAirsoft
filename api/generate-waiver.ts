import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// --------------------------------------------------
// ENV VERIFICATION (temporary – safe to remove later)
// --------------------------------------------------
console.log("SUPABASE_URL =", process.env.SUPABASE_URL)
console.log(
  "SUPABASE_SERVICE_ROLE_KEY =",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING"
)

// --------------------------------------------------
// Supabase server client (SERVICE ROLE)
// --------------------------------------------------
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
)

export const config = {
  runtime: "nodejs",
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // ---------------------------
    // Method check
    // ---------------------------
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    // ---------------------------
    // Extract & validate body
    // ---------------------------
    const { name, dob, emergencyName, emergencyPhone, parentName } = req.body

    if (!name || !dob || !emergencyName || !emergencyPhone) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // ---------------------------
    // Load waiver template PDF
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

    // ---------------------------
    // PAGE 3 — ACKNOWLEDGMENT & SIGNATURE
    // ---------------------------
    const page = pages[2]
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    const draw = (text: string, x: number, y: number) => {
      page.drawText(String(text), {
        x,
        y,
        size: 11,
        font,
        color: black,
      })
    }

    // ---------------------------
    // FIELD COORDINATES (FINAL)
    // ---------------------------
    const x = 230

    const yParticipant = 570
    const yDob = 545
    const ySignature = 520
    const yEmergency = 498
    const yDateSigned = 470

    draw(name, x, yParticipant)                         // Participant Name
    draw(dob, x, yDob)                                  // Date of Birth
    draw(name, x, ySignature)                           // Signature
    draw(`${emergencyName} - ${emergencyPhone}`, x + 47, yEmergency)
    draw(new Date().toLocaleDateString(), x, yDateSigned)

    // ---------------------------
    // Parent / Guardian (Minors)
    // ---------------------------
    if (parentName) {
      const yParentName = 329
      const yParentSignature = 305
      const yParentDate = 277

      draw(parentName, x, yParentName)
      draw(parentName, x, yParentSignature)
      draw(new Date().toLocaleDateString(), x, yParentDate)
    }

    // ---------------------------
    // Generate final PDF bytes
    // ---------------------------
    const outputBytes = await pdfDoc.save()

    // ===========================
    // UPLOAD TO SUPABASE STORAGE
    // ===========================
    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const fileName = `waivers/${safeName}-${Date.now()}.pdf`

    const { error: uploadError } = await supabase.storage
      .from("waivers")
      .upload(fileName, Buffer.from(outputBytes), {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("Supabase upload failed:", uploadError)
      return res.status(500).json({
        error: "Failed to upload waiver",
      })
    }

    // ---------------------------
    // Return PDF to browser
    // ---------------------------
    return res.status(200).json({
     success: true,
      file: fileName,
    })

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
