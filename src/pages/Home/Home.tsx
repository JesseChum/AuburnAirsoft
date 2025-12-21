import airsoftImage from "../../assets/image0.jpeg"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <section
    className="relative min-h-screen bg-cover bg-center flex items-center"
    style={{backgroundImage: `url(${airsoftImage})`}}>
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/60"></div>

    {/* Content */}
    <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
        Auburn Airsoft
      </h1>
    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8">
      Community-run outdoor airsoft events in Auburn, WA.
      Free to play. Respect driven. Player Focused.
    </p>

    <div className="flex flex-wrap gap-4">
      <Link
      to="/events" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md transition">
        View Calendar
      </Link>

        <Link
        to="/rules" className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded-md transition">
        Read the Rules
       </Link>
     </div>
    </div>
  </section>
  )
}