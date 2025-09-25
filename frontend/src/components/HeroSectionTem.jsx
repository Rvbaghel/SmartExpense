import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="hero-title">
                Take Control of Your <br />
                <span style={{
                  background: 'linear-gradient(135deg, var(--bs-secondary, #21d4a7) 0%, var(--bs-primary, #238be6) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  SmartExpense
                </span>
              </h1>
              <p className="lead mb-4" style={{ 
                fontSize: '1.25rem', 
                lineHeight: '1.7',
                color: 'var(--bs-body-color, #212529)',
                opacity: '0.9'
              }}>
                Simple and powerful expense tracking. Add your monthly salary, upload expenses via CSV, 
                and get beautiful insights about your spending habits. No complexity, just results.
              </p>
              
              {/* Key Benefits */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--bs-success, #28a745)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <i className="bi bi-check text-white" style={{ fontSize: '0.875rem', fontWeight: 'bold' }}></i>
                  </div>
                  <span style={{ color: 'var(--text-muted, #6c757d)' }}>CSV/Excel bulk upload support</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--bs-success, #28a745)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <i className="bi bi-check text-white" style={{ fontSize: '0.875rem', fontWeight: 'bold' }}></i>
                  </div>
                  <span style={{ color: 'var(--text-muted, #6c757d)' }}>Beautiful charts and analytics</span>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--bs-success, #28a745)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <i className="bi bi-check text-white" style={{ fontSize: '0.875rem', fontWeight: 'bold' }}></i>
                  </div>
                  <span style={{ color: 'var(--text-muted, #6c757d)' }}>Smart spending recommendations</span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3">
                
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--bs-border-color, #dee2e6)' }}>
                <div className="d-flex flex-wrap align-items-center gap-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check text-success me-2"></i>
                    <small style={{ color: 'var(--text-muted, #6c757d)' }}>Secure & Private</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-cloud-upload text-primary me-2"></i>
                    <small style={{ color: 'var(--text-muted, #6c757d)' }}>Easy CSV Upload</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-graph-up-arrow text-success me-2"></i>
                    <small style={{ color: 'var(--text-muted, #6c757d)' }}>Real-time Analytics</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="text-center mt-5 mt-lg-0 position-relative">
              {/* Background decorative elements */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--bs-primary, #238be6), var(--bs-secondary, #21d4a7))',
                opacity: '0.1',
                animation: 'float 6s ease-in-out infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '15%',
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--bs-secondary, #21d4a7), var(--bs-primary, #238be6))',
                opacity: '0.1',
                animation: 'float 8s ease-in-out infinite reverse'
              }}></div>
              
              {/* Main visual element */}
              <div className="position-relative d-inline-block" style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'var(--bs-card-bg, #f8f9fa)',
                border: '1px solid var(--bs-border-color, #dee2e6)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                {/* Dashboard mockup */}
                <div style={{
                  width: '280px',
                  height: '200px',
                  background: 'linear-gradient(135deg, var(--bs-primary, #238be6) 0%, var(--bs-secondary, #21d4a7) 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 12px'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Monthly Overview</span>
                    <i className="bi bi-three-dots"></i>
                  </div>
                  
                  <div className="text-center mt-3">
                    <i className="bi bi-bar-chart-line" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                      ₹45,000
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                      Total Expenses This Month
                    </div>
                  </div>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '20px',
                    right: '20px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <div className="text-center">
                      <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Salary</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>₹80K</div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Saved</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>₹35K</div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontSize: '0.75rem', opacity: '0.8' }}>Categories</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>8</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--bs-success, #28a745)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
                }}>
                  <i className="bi bi-check-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .min-vh-75 {
          min-height: 75vh;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection