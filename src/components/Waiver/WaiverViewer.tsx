
import { useState } from "react"

export default function WaiverViewer() {
  const [accepted, setAccepted] = useState(false)
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")

  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")

  const [parentName, setParentName] = useState("")
  const [parentAccepted, setParentAccepted] = useState(false)

  // ---- Helpers ----
  function isMinor(dob: string) {
    if (!dob) return false

    const birthDate = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age < 18
  }

  const minor = isMinor(dob)

  const canSubmit =
    accepted &&
    name &&
    dob &&
    emergencyName &&
    emergencyPhone &&
    (!minor || (parentName && parentAccepted))

  // ---- Submit handler ----
  async function submitWaiver() {
    try {
      const response = await fetch("/api/generate-waiver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dob,
          emergencyName,
          emergencyPhone,
          parentName: minor ? parentName : null,
          signedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        alert("Failed to submit waiver")
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "Auburn-Airsoft-Waiver.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)

      alert("Waiver submitted successfully")
    } catch (err) {
      console.error(err)
      alert("There was an error submitting the waiver.")
    }
  }

  return (
    <div className="space-y-6">
      {/* PDF Viewer */}
      <div className="border border-gray-700 rounded-lg overflow-hidden">
       <iframe
          src="/AuburnAirsoftWaiver.pdf"
          className="w-full h-[600px]"
          title="Waiver PDF"
/>
      </div>

      {/* Agreement Section */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div>
          <label className="block text-sm mb-1">Full Legal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Emergency Contact Name</label>
          <input
            type="text"
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Emergency Contact Phone</label>
          <input
            type="tel"
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
          />
        </div>

        {minor && (
          <div className="border-t border-gray-700 pt-6 space-y-4">
            <h3 className="text-lg font-bold text-green-400">
              Parent or Legal Guardian Consent
            </h3>

            <div>
              <label className="block text-sm mb-1">
                Parent / Guardian Full Name
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
              />
            </div>

            <label className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                checked={parentAccepted}
                onChange={(e) => setParentAccepted(e.target.checked)}
              />
              <span>
                I am the parent or legal guardian and consent to participation.
              </span>
            </label>
          </div>
        )}

        <label className="flex items-start space-x-2 text-sm">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span>
            Typing my name constitutes an electronic signature and agreement.
          </span>
        </label>

        <button
          disabled={!canSubmit}
          onClick={submitWaiver}
          className={`px-6 py-3 rounded font-semibold transition ${
            canSubmit
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Submit Waiver
        </button>
      </div>
    </div>
  )
}
