import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext' // ✅ import user context

const Navbar = () => {
  const { user, logout } = useUser() // ✅ get user & logout from context
  const { isDarkMode, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = React.useState(false)

  const isActive = (path) => location.pathname === path
  const toggleNavbar = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    logout() // ✅ use context logout
    navigate('/login')
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg sticky-top" role="navigation" aria-label="Main navigation">
        <div className="container">
          <Link className="navbar-brand" to="/">
            💰 Personal Salary Manager
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarNav"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                  to="/"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/salary-input') ? 'active' : ''}`}
                  to="/salary-input"
                  onClick={() => setIsOpen(false)}
                >
                  Salary
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
                  to="/expenses"
                  onClick={() => setIsOpen(false)}
                >
                  Expenses
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                  to="/about"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </li>

              {/* Show SignUp & Login if no user, else Profile & Logout */}
              {!user ? (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/signup') ? 'active' : ''}`}
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                    >
                      SignUp
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                      to="/login"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              )}

              <li className="nav-item">
                <button className="theme-switch" onClick={toggleTheme} aria-label="Toggle theme">
                  <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
