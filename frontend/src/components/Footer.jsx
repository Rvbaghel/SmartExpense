import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer utility-py-6" role="contentinfo">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="mb-3">
              <span className="h5 fw-bold">💰 Personal Salary Manager</span>
            </div>
            <p className="text-muted mb-3">
              Smart financial management for modern professionals. Track, analyze, and optimize your money with AI-powered insights.
            </p>
            <div className="footer-links">
              <a href="mailto:contact@salarymanager.com" className="me-3" aria-label="Email contact">
                <i className="bi bi-envelope me-1"></i>Contact
              </a>
              <a href="#" className="me-3" aria-label="Privacy policy">Privacy</a>
              <a href="#" aria-label="Terms of service">Terms</a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-3">
            <h6 className="fw-bold mb-3">Features</h6>
            <div className="footer-links d-flex flex-column">
              <Link to="/salary-input" className="mb-2">Salary Input</Link>
              <Link to="/expenses" className="mb-2">Expense Tracking</Link>
              <Link to="/dashboard" className="mb-2">Dashboard</Link>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-3">
            <h6 className="fw-bold mb-3">Company</h6>
            <div className="footer-links d-flex flex-column">
              <Link to="/about" className="mb-2">About Us</Link>
              <a href="#" className="mb-2">Blog</a>
              <a href="#" className="mb-2">Careers</a>
              <a href="#" className="mb-2">Support</a>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3">Stay Updated</h6>
            <p className="text-muted mb-3">Get the latest financial tips and product updates.</p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Enter your email" 
                aria-label="Email for newsletter"
              />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">&copy; Vishal Baghel.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="footer-links">
              <a href="#" className="me-3" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="me-3" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="me-3" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer