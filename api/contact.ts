import type { VercelRequest, VercelResponse } from "@vercel/node"
import nodemailer from "nodemailer"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

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
    await transporter.sendMail({
      from: `"Auburn Airsoft Contact" <${process.env.EMAIL_USER}>`,
      to: "auburncommunityairsoft@gmail.com",
      subject: "New Contact Form Submission",
      replyTo: email,
      text: `
Name: ${name || "N/A"}
Email: ${email}

Message:
${message}
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Failed to send email" })
  }
}
