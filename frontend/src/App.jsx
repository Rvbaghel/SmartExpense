import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SalaryInput from './pages/SalaryInput'
import Expenses from './pages/Expenses'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ThemeProvider from './context/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Navbar />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/salary-input" element={<SalaryInput />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App