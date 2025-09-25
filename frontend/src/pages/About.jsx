import React from 'react'

const About = () => {
  return (
    <div className="container py-5">
      {/* About SmartExpense Section */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <h1 className="display-4 fw-bold mb-4" style={{
            background: 'linear-gradient(135deg, var(--bs-primary, #007BFF) 0%, var(--bs-secondary, #6c757d) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            About SmartExpense
          </h1>
          <p className="lead mb-4">
            Simple and powerful personal finance management made easy.
          </p>
        </div>
      </div>

      {/* Project Details */}
      <div className="row mb-5">
        <div className="col-lg-10 mx-auto">
          <div className="card shadow-sm border-0" style={{
            background: 'var(--bs-card-bg, #f8f9fa)',
            border: '1px solid var(--bs-border-color, #dee2e6)'
          }}>
            <div className="card-body p-4">
              <h3 className="card-title mb-4">
                <i className="bi bi-laptop text-primary me-2"></i>
                What is SmartExpense?
              </h3>
              
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-primary mb-3">Purpose</h5>
                  <p className="mb-4">
                    SmartExpense is a personal finance application designed to help you track your monthly salary 
                    and expenses effortlessly. Analyze your spending patterns, visualize your financial data, 
                    and make informed decisions about your money.
                  </p>
                  
                  <h5 className="text-primary mb-3">Key Features</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Monthly salary tracking
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      CSV/Excel expense upload
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Manual expense entry
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Category-wise expense tracking
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Interactive dashboard with charts
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Spending trend analysis
                    </li>
                  </ul>
                </div>
                
                <div className="col-md-6">
                  <h5 className="text-primary mb-3">How It Works</h5>
                  <div className="d-flex align-items-start mb-3">
                    <div className="step-number me-3" style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'var(--bs-primary, #007BFF)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      flexShrink: '0'
                    }}>1</div>
                    <div>
                      <strong>Add Monthly Salary</strong>
                      <p className="mb-0 text-muted small">Enter your monthly income to start tracking</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-3">
                    <div className="step-number me-3" style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'var(--bs-secondary, #6c757d)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      flexShrink: '0'
                    }}>2</div>
                    <div>
                      <strong>Upload Expenses</strong>
                      <p className="mb-0 text-muted small">Bulk upload via CSV/Excel or add manually</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-3">
                    <div className="step-number me-3" style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#28a745',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      flexShrink: '0'
                    }}>3</div>
                    <div>
                      <strong>Review & Validate</strong>
                      <p className="mb-0 text-muted small">Check and edit your data before finalizing</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <div className="step-number me-3" style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#ffc107',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      flexShrink: '0'
                    }}>4</div>
                    <div>
                      <strong>Analyze Dashboard</strong>
                      <p className="mb-0 text-muted small">View charts and insights about your spending</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--bs-border-color, #dee2e6)' }}>
                <h5 className="text-primary mb-3">Technology Stack</h5>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-dark">JavaScript</span>
                  <span className="badge bg-primary">React+vite</span>
                  <span className="badge bg-secondary">python</span>
                  <span className="badge bg-success">flask</span>
                  <span className="badge bg-warning text-dark">postgresql</span>
                  <span className="badge bg-info">Bootstrap</span>
                  <span className="badge bg-dark">JavaScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h2 className="text-center mb-5" style={{ color: 'var(--bs-body-color, #212529)' }}>
            Meet the Developer
          </h2>
          
          <div className="card shadow-lg border-0" style={{
            background: 'var(--bs-card-bg, #f8f9fa)',
            border: '1px solid var(--bs-border-color, #dee2e6)',
            borderRadius: '16px'
          }}>
            <div className="card-body p-5">
              <div className="row align-items-center">
                <div className="col-md-4 text-center mb-4 mb-md-0">
                 <div
  style={{
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--bs-primary, #007BFF), var(--bs-secondary, #6c757d))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontSize: '3rem',
    color: 'white',
    border: '4px solid white',
    boxShadow: '0 8px 32px rgba(0, 123, 255, 0.3)',
    overflow: 'hidden' // ✅ ensure image stays inside the circle
  }}
>
  <img 
    src="/path/to/your/image.jpg" // replace with your image path
    alt="Profile"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>

                </div>
                
                <div className="col-md-8">
                  <h3 className="card-title mb-3" style={{ color: 'var(--bs-body-color, #212529)' }}>
                    Vishal Baghel
                  </h3>
                  <p className="text-muted mb-3">
                    Master's Student | Full Stack Developer
                  </p>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-mortarboard text-primary me-3"></i>
                      <span>Master's Student at Gujarat University</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-building text-primary me-3"></i>
                      <span>Rollwala Computer Center</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-envelope text-primary me-3"></i>
                      <a href="mailto:baghelvishal264@gmail.com" className="text-decoration-none" style={{ color: 'var(--bs-primary, #007BFF)' }}>
                        baghelvishal264@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-3">
                    <a 
                      href="https://github.com/Rvbaghel" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline-dark d-flex align-items-center"
                      style={{ textDecoration: 'none' }}
                    >
                      <i className="bi bi-github me-2"></i>
                      GitHub
                    </a>
                    <a 
                      href="https://in.linkedin.com/in/vishal-baghel-a055b5249" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary d-flex align-items-center"
                      style={{ textDecoration: 'none' }}
                    >
                      <i className="bi bi-linkedin me-2"></i>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--bs-border-color, #dee2e6)' }}>
                <p className="text-center mb-0" style={{ color: 'var(--text-muted, #6c757d)' }}>
                  <em>"Building SmartExpense to make personal finance management simple and accessible for everyone."</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About