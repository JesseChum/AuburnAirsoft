import airsoftImage from "../../assets/image0.jpeg"

export default function Contact() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${airsoftImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl bg-zinc-900/60 rounded-lg shadow-lg px-8 py-10 text-white">
        
        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-green-400 mb-3">
          CONTACT US
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Send us a message!
        </p>

        {/* FORM */}
        <form className="space-y-5">
          
          {/* NAME */}
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email *"
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* MESSAGE */}
          <textarea
            placeholder="Message"
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

          {/* SMALLER SEND BUTTON */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2 rounded-md transition"
            >
              SEND
            </button>
          </div>
          <p className="text-center text-gray-300 mb-8">
              For any emergency please call the main organizer directly.
            </p>
        </form>
      </div>
    </section>
  )
}