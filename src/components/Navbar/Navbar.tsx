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

          <NavLink to="/field"
           className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-green-400"
                  : "text-gray-300 hover:text-green-400"
              }`
            }
          >
            Field
          </NavLink>

          <NavLink to="/Info"
          className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-green-400"
                  : "text-gray-300 hover:text-green-400"
              }`
            }
          >
            Info
          </NavLink>
          
          {/* CONTACT BUTTON */}
        <NavLink
          to="/contact"
          className="ml-6 bg-white text-green-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition"
        >
          Contact
        </NavLink>
        </div>
      </div>
    </nav>
  )
}
