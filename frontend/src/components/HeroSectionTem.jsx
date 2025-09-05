import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="hero-title">Master Your Financial Future</h1>
            <p className="lead mb-4">
              AI-powered salary management that transforms how you track income, control expenses, 
              and optimize your financial health. Smart insights, effortless tracking.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/salary-input" className="btn btn-primary btn-lg">
                Start Managing <i className="bi bi-arrow-right ms-2"></i>
              </Link>
              <Link to="/dashboard" className="btn btn-outline-secondary btn-lg">
                View Demo <i className="bi bi-play-circle ms-2"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="text-center mt-5 mt-lg-0">
              <div className="position-relative d-inline-block">
                <i className="bi bi-graph-up text-primary" style={{fontSize: '8rem', opacity: '0.8'}}></i>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <i className="bi bi-currency-dollar text-secondary" style={{fontSize: '3rem'}}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection