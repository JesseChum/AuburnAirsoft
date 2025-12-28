import { Link, NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-green-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link
          to="/home"
          className="text-xl font-bold text-white tracking-wide"
        >
          Auburn Airsoft Community Field
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-green-400"
                  : "text-gray-300 hover:text-green-400"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-green-400"
                  : "text-gray-300 hover:text-green-400"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/rules"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-green-400"
                  : "text-gray-300 hover:text-green-400"
              }`
            }
          >
            Rules
          </NavLink>

          <NavLink
            to="/waiver"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-green-400"
                  : "text-gray-300 hover:text-green-400"
              }`
            }
          >
            Waiver
          </NavLink>

           <NavLink
            to="/events"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-green-400"
                  : "text-gray-300 hover:text-green-400"
              }`
            }
          >
            Events
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
