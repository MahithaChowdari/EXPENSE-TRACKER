import { Link, NavLink } from "react-router-dom";
import { FaWallet } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <FaWallet className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Expense Tracker
            </h1>

            <p className="text-xs text-gray-500">
              Smart Student Finance
            </p>
          </div>

        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10 font-medium">

          <li>
            <a
              href="#home"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Features
            </a>
          </li>

          <li>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </a>
          </li>

          <li>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Contact
            </a>
          </li>

        </ul>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <NavLink to="/login">
            <button className="px-5 py-2.5 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition duration-300">
              Login
            </button>
          </NavLink>

          <NavLink to="/register">
            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition duration-300">
              Register
            </button>
          </NavLink>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;