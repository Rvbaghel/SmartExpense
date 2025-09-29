import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { useUser } from "../context/UserContext"

const Navbar = () => {
  const { user, logout } = useUser()
  const { isDarkMode, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate("/login")
    setIsOpen(false)
  }

  // Common navigation links
  const commonLinks = [
    { path: "/", label: "Home" },
    { path: "/salary-input", label: "Salary" },
    { path: "/expenses", label: "Expenses" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/about", label: "About" },
  ]

  // Auth-dependent links
  const authLinks = !user
    ? [
      { path: "/signup", label: "SignUp" },
      { path: "/login", label: "Login" },
    ]
    : [
      { path: "/track-info", label: "Information" },
      { path: "/profile", label: "Profile" },
      { path: "/logout", label: "Logout", action: handleLogout },
    ]

  return (
    <header className="shadow-md bg-white dark:bg-gray-900 ">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between ">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold no-underline">
          <span className="text-sky-500 dark:text-teal-500">Smart</span>Expense
        </Link>

        {/* Mobile toggle button */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Links */}
        <div
          className={`flex-col lg:flex-row lg:flex items-center gap-4 absolute lg:static left-0 w-full lg:w-auto bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent p-4 lg:p-0 transition-all ${isOpen ? "top-14 opacity-100" : "top-[-500px] opacity-0 lg:opacity-100"
            }`}
        >
          {[...commonLinks, ...authLinks].map((link, idx) =>
            link.label === "Logout" ? (
              <button
                key={idx}
                onClick={link.action}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition no-underline ${isActive(link.path)
                  ? "bg-sky-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Theme toggle */}
          <button
            onClick={
              () => {
                document.documentElement.classList.toggle('dark')
              }
            }
            className="ml-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle theme"
          >
            {isDarkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
