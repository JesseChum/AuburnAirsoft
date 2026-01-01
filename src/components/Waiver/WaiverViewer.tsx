import { useState } from "react"

export default function WaiverViewer() {
  const [accepted, setAccepted] = useState(false)
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [parentName, setParentName] = useState("")
  const [parentAccepted, setParentAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  setError(null)
  setIsSubmitting(true)

  try {
    const res = await fetch("/api/submit-waiver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        dob,
        emergencyName,
        emergencyPhone,
        parentName: minor ? parentName : null,
        minor,
      }),
    })

    if (!res.ok) {
      throw new Error("Submission failed")
    }

    // Receive and open PDF
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")

    setIsSubmitted(true)
  } catch (err) {
    console.error(err)
    setError("There was an error submitting the waiver.")
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* ================= PDF PREVIEW ================= */}
      <section className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-lg">
        <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Waiver Preview</h2>
          <a
            href="/AuburnAirsoftWaiver.pdf"
            target="_blank"
            className="text-green-400 text-sm hover:underline"
          >
            Open full PDF
          </a>
        </div>

        <iframe
          src="/AuburnAirsoftWaiver.pdf"
          className="w-full h-[500px] bg-white block"
          title="Waiver PDF"
        />
      </section>

      {/* ================= FORM ================= */}
      <section className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-green-400">
          Electronic Waiver Form
        </h2>

        <div>
          <label className="block text-sm mb-1">Full Legal Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Emergency Contact Name</label>
          <input
            type="text"
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Emergency Contact Phone</label>
          <input
            type="tel"
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
          />
        </div>

        {minor && (
          <div className="border-t border-zinc-700 pt-4 space-y-4">
            <h3 className="text-lg font-bold text-yellow-400">
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
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
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

        <label className="flex items-start space-x-2 text-sm pt-2">
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
          onClick={submitWaiver}
          disabled={!canSubmit || isSubmitting || isSubmitted}
          className={`w-full py-3 rounded-lg font-semibold transition
            ${
              isSubmitted
                ? "bg-green-600 text-white cursor-default"
                : isSubmitting
                ? "bg-gray-500 text-white cursor-wait"
                : canSubmit
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
        >
          {isSubmitted
            ? "Waiver Submitted ✓"
            : isSubmitting
            ? "Submitting…"
            : "Submit Waiver"}
          </button>
          {isSubmitted && (
            //Confirmation text after submission
          <p className="mt-3 text-sm text-green-400 text-center">
            Your waiver has been successfully submitted.
          </p>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">
            {error}
          </p>
        )}
      </section>
    </div>
  )
}
