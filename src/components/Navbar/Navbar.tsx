import { Link, NavLink } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/rules", label: "Rules" },
    { to: "/waiver", label: "Waiver" },
    { to: "/events", label: "Events" },
    { to: "/field", label: "Field" },
    { to: "/info", label: "Info" },
  ]

  return (
    <nav className="bg-green-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center">
        
        {/* LOGO */}
        <Link
          to="/home"
          className="text-xl font-bold text-white tracking-wide"
        >
          Auburn Airsoft Community Field
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-6 ml-auto">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-green-400"
                    : "text-gray-300 hover:text-green-400"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* CONTACT BUTTON (DESKTOP) */}
          <NavLink
            to="/contact"
            className="ml-4 bg-white text-green-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
          >
            Contact
          </NavLink>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="ml-auto md:hidden text-white text-2xl"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-green-900 border-t border-green-800 px-6 py-4 space-y-4">
          {[...navLinks, { to: "/contact", label: "Contact" }].map(
            ({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block text-base font-medium ${
                    isActive
                      ? "text-green-400"
                      : "text-gray-200 hover:text-green-400"
                  }`
                }
              >
                {label}
              </NavLink>
            )
          )}
        </div>
      )}
    </nav>
  )
}
