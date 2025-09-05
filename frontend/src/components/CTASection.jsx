import React from 'react'
import { Link } from 'react-router-dom'

const CTASection = () => {
  return (
    <section className="utility-py-6 bg-dark">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="display-5 fw-bold mb-3">Ready to Master Your Money?</h2>
            <p className="lead mb-4">
              Join thousands who've taken control of their finances. Start your journey to financial freedom today.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/salary-input" className="btn btn-primary btn-lg">
                Get Started Now <i className="bi bi-rocket ms-2"></i>
              </Link>
              <Link to="/about" className="btn btn-outline-secondary btn-lg">
                Learn More <i className="bi bi-info-circle ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection