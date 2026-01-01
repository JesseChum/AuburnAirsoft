import type { VercelRequest, VercelResponse } from "@vercel/node"
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib"
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

export const config = {
  runtime: "nodejs",
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// helper: keep date consistent everywhere
function formatDateMMDDYYYY(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return res.status(405).send("POST only")

    const {
      name = "",
      dob = "",
      emergencyName = "",
      emergencyPhone = "",
      parentName = "",
      minor = false,
    } = req.body || {}

    const pdfPath = path.join(process.cwd(), "public", "AuburnAirsoftWaiver.pdf")
    if (!fs.existsSync(pdfPath)) throw new Error("Base waiver PDF not found")

    const baseBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(baseBytes)

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const black = rgb(0, 0, 0)

    const pages = pdfDoc.getPages()
    const todayStr = formatDateMMDDYYYY(new Date())

    // ============================
    // PAGE 1 (index 0) — "Date:" line at top
    // ============================
    const page1 = pages[0]
    page1.setRotation(degrees(0))

    // Adjust these if needed by a few px after testing
    // (x,y) should land on the "Date: ______" line on page 1.
    page1.drawText(todayStr, {
      x: 120,
      y: page1.getHeight() - 132,
      size: 11,
      font,
      color: black,
    })

    // ============================
    // PAGE 3 (index 2) — signature page
    // ============================
    const page3 = pages[2]
    page3.setRotation(degrees(0))

    // helper for page 3
    const draw3 = (text: string, x: number, y: number, size = 11) => {
      page3.drawText(String(text ?? ""), { x, y, size, font, color: black })
    }

    // ---- Coordinates tuned for your screenshot ----
    // If the “top section” is off, tweak Y values by ±3..±10 until perfect.
    const xMain = 230
    const xEmergency = 280
    // TOP SECTION (adjusted)
    draw3(name, xMain, 567)                      // Participant Name
    draw3(dob, xMain, 542)                       // Date of Birth
    draw3(name, xMain, 518)                      // Signature (typed name)
    draw3(`${emergencyName} - ${emergencyPhone}`, xEmergency, 494) // Emergency contact
    draw3(todayStr, xMain, 470)                  // Date Signed

    // BOTTOM SECTION (you said this is perfect—kept same)
    if (minor && parentName) {
      draw3(parentName, xMain, 330)              // Parent/Guardian Name
      draw3(parentName, xMain, 305)              // Parent Signature
      draw3(todayStr, xMain, 280)                // Parent Date Signed
    }

    // ============================
    // SAVE, UPLOAD, RETURN
    // ============================
    const finalPdfBytes = await pdfDoc.save()

    const filename = `waiver-${Date.now()}.pdf`
    const { error } = await supabase.storage
      .from("waivers")
      .upload(filename, finalPdfBytes, {
        contentType: "application/pdf",
        upsert: false,
      })
    if (error) throw new Error("Supabase upload failed: " + error.message)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    return res.status(200).send(Buffer.from(finalPdfBytes))
  } catch (err) {
    console.error("WAIVER ERROR:", err)
    return res.status(500).send("Waiver generation failed")
  }
}
