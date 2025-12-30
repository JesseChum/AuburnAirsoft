import type { VercelRequest, VercelResponse } from "@vercel/node"
import nodemailer from "nodemailer"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  console.log("ENV CHECK:", {
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_PASS: !!process.env.EMAIL_PASS,
  })

  const { name, email, message } = req.body

  if (!email || !message) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    // 🔥 THIS LINE TELLS US IF GMAIL AUTH WORKS
    await transporter.verify()

    await transporter.sendMail({
      from: `"Auburn Airsoft Contact" <${process.env.EMAIL_USER}>`,
      to: "auburncommunityairsoft@gmail.com",
      replyTo: email,
      subject: "New Contact Form Submission",
      text: `
Name: ${name || "N/A"}
Email: ${email}

Message:
${message}
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("MAIL ERROR:", error)
    return res.status(500).json({ message: "Failed to send email" })
  }
}
