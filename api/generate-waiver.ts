import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const {
    name,
    dob,
    emergencyName,
    emergencyPhone,
    parentName,
    signedAt,
  } = req.body

  if (!name || !dob || !emergencyName || !emergencyPhone) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // For now: just store data (later → PDF or DB)
  console.log("Waiver submitted:", {
    name,
    dob,
    emergencyName,
    emergencyPhone,
    parentName,
    signedAt,
  })

  return res.status(200).json({ success: true })
}
