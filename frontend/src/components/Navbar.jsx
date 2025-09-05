import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const toggleNavbar = () => {
    setIsOpen(!isOpen)
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
                  aria-current={isActive('/') ? 'page' : undefined}
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
              <li className="nav-item">
                <button 
                  className="theme-switch" 
                  onClick={toggleTheme} 
                  aria-label="Toggle theme"
                >
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