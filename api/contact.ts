import type { VercelRequest, VercelResponse } from "@vercel/node"
import nodemailer from "nodemailer"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" })
  }

  const { name, email, message } = req.body ?? {}

  if (!email || !message) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields",
    })
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({
      ok: false,
      error: "Email environment variables not set",
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Auburn Airsoft Contact" <${process.env.EMAIL_USER}>`,
      to: "auburncommunityairsoft@gmail.com",
      replyTo: email,
      subject: "New Contact Form Submission",
      text: `Name: ${name || "N/A"}
Email: ${email}

Message:
${message}`,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    if (err instanceof Error) {
      console.error("CONTACT API ERROR:", err.message)
    } else {
      console.error("CONTACT API ERROR:", err)
    }

    return res.status(500).json({
      ok: false,
      error: "Server error sending email",
    })
  }
}
