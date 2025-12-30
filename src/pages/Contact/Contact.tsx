import airsoftImage from "../../assets/image0.jpeg"
import { useState } from "react"

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setStatus("sending")

  const formData = new FormData(e.currentTarget)

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.status === 200) {
      setStatus("success")
      e.currentTarget.reset()
    } else {
      throw new Error(`Server responded with ${res.status}`)
    }
  } catch (err) {
    console.error("Frontend submit error:", err)
    setStatus("error")
  }
}

  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${airsoftImage})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-xl bg-zinc-900/90 rounded-lg px-8 py-10 text-white">
        <h1 className="text-3xl font-extrabold text-center text-green-400 mb-3">
          CONTACT US
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Drop us a line!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email *"
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3"
          />

          <textarea
            name="message"
            placeholder="Message"
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 resize-none"
          />

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-sm px-6 py-2 rounded-md"
            >
              {status === "sending" ? "Sending..." : "Send"}
            </button>
          </div>

          {status === "success" && (
            <p className="text-green-400 text-center text-sm mt-2">
              Message sent successfully!
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400 text-center text-sm mt-2">
              Failed to send message. Try again.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
