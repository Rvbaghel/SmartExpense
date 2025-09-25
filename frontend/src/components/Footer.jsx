import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer utility-py-6" role="contentinfo">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="mb-3">
              <span className="h5 fw-bold" style={{ color: 'var(--bs-primary, #007BFF)' }}>
                 SmartExpense
              </span>
            </div>
            <p className="text-muted mb-3">
              Simple personal finance management for everyone. Track your monthly salary and expenses 
              with beautiful analytics to make better financial decisions.
            </p>
            <div className="footer-links">
              <a href="mailto:baghelvishal264@gmail.com" className="me-3" aria-label="Email contact">
                <i className="bi bi-envelope me-1"></i>Contact
              </a>
              <Link to="/about" className="me-3" aria-label="About page">About</Link>
              <a href="#features" className="me-3" aria-label="Features section">Features</a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--bs-body-color, #212529)' }}>
              Quick Start
            </h6>
            <div className="footer-links d-flex flex-column">
              <Link to="/salary-input" className="mb-2">Add Salary</Link>
              <Link to="/expenses" className="mb-2">Upload Expenses</Link>
              <Link to="/dashboard" className="mb-2">View Dashboard</Link>
              <Link to="/profile" className="mb-2">My Profile</Link>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--bs-body-color, #212529)' }}>
              Resources
            </h6>
            <div className="footer-links d-flex flex-column">
              <Link to="/about" className="mb-2">About SmartExpense</Link>
              <a href="#how-it-works" className="mb-2">How It Works</a>
              <a href="https://github.com/Rvbaghel" target="_blank" rel="noopener noreferrer" className="mb-2">
                Source Code
              </a>
              <a href="mailto:baghelvishal264@gmail.com" className="mb-2">Support</a>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--bs-body-color, #212529)' }}>
              Get In Touch
            </h6>
            <p className="text-muted mb-3">
              Have questions about SmartExpense? Reach out to the developer.
            </p>
            <div className="d-flex flex-column gap-2 mb-3">
              <a 
                href="mailto:baghelvishal264@gmail.com" 
                className="d-flex align-items-center text-decoration-none"
                style={{ color: 'var(--bs-primary, #007BFF)' }}
              >
                <i className="bi bi-envelope me-2"></i>
                baghelvishal264@gmail.com
              </a>
              <div className="d-flex align-items-center text-muted">
                <i className="bi bi-geo-alt me-2"></i>
                Gujarat University, India
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-4" style={{ borderColor: 'var(--bs-border-color, #dee2e6)' }} />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              {new Date().getFullYear()} SmartExpense by{' '}
              <strong style={{ color: 'var(--bs-primary, #007BFF)' }}>Vishal Baghel</strong>. 
              Built with  for better financial management.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="footer-links d-flex justify-content-md-end gap-3">
              <a 
                href="https://github.com/Rvbaghel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bs-dark, #212529)',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease'
                }}
                aria-label="GitHub Profile"
                onMouseOver={(e) => e.target.closest('a').style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.closest('a').style.transform = 'translateY(0)'}
              >
                <i className="bi bi-github"></i>
              </a>
              <a 
                href="https://in.linkedin.com/in/vishal-baghel-a055b5249" 
                target="_blank" 
                rel="noopener noreferrer"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#0A66C2',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease'
                }}
                aria-label="LinkedIn Profile"
                onMouseOver={(e) => e.target.closest('a').style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.closest('a').style.transform = 'translateY(0)'}
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a 
                href="mailto:baghelvishal264@gmail.com"
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bs-danger, #dc3545)',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease'
                }}
                aria-label="Email Contact"
                onMouseOver={(e) => e.target.closest('a').style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.closest('a').style.transform = 'translateY(0)'}
              >
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer