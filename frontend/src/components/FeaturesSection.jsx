import React from 'react'
import { Link } from 'react-router-dom'
import FeatureCard from './FeatureCard'

const FeaturesSection = () => {
  const features = [
    {
      icon: 'bi-currency-dollar',
      iconClass: 'icon-salary',
      title: 'Monthly Salary Tracking',
      description: 'Add and manage your monthly salary easily. Track your income month by month to understand your earnings pattern.',
      link: '/salary-input',
      linkText: 'Add Salary'
    },
    {
      icon: 'bi-receipt-cutoff',
      iconClass: 'icon-expense',
      title: 'Smart Expense Management',
      description: 'Upload expenses via CSV/Excel or add manually. Categorize your spending and link expenses to specific months.',
      link: '/expenses',
      linkText: 'Add Expenses'
    },
    {
      icon: 'bi-bar-chart-line',
      iconClass: 'icon-dashboard',
      title: 'Visual Analytics Dashboard',
      description: 'View beautiful charts showing salary vs expenses, category breakdowns, and spending trends over time.',
      link: '/dashboard',
      linkText: 'View Analytics'
    },
    {
      icon: 'bi-lightbulb',
      iconClass: 'icon-ai',
      title: 'Smart Insights',
      description: 'Get personalized recommendations based on your spending patterns to improve your financial health.',
      link: '/dashboard',
      linkText: 'Get Insights'
    }
  ]

  return (
    <section className="utility-py-6" id="features" style={{
      background: 'var(--bs-card-bg, #f8f9fa)',
      borderTop: '1px solid var(--bs-border-color, #dee2e6)',
      borderBottom: '1px solid var(--bs-border-color, #dee2e6)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{
              background: 'linear-gradient(135deg, var(--bs-primary, #007BFF) 0%, var(--bs-secondary, #6c757d) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Simple Finance Management Made Easy
            </h2>
            <p className="lead" style={{ color: 'var(--text-muted, #6c757d)' }}>
              Track your salary and expenses effortlessly. Upload CSV files, visualize your spending, 
              and make informed financial decisions with SmartExpense.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
        
        {/* Quick Steps Section */}
        <div className="row mt-5 pt-4" style={{ borderTop: '1px solid var(--bs-border-color, #dee2e6)' }}>
          <div className="col-12 text-center mb-4">
            <h4 className="fw-semibold" style={{ color: 'var(--bs-body-color, #212529)' }}>
              How SmartExpense Works
            </h4>
          </div>
          <div className="col-md-3 col-6 text-center mb-3">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--bs-primary, #007BFF), #1e7ddb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              1
            </div>
            <h6 className="fw-semibold">Add Salary</h6>
            <small style={{ color: 'var(--text-muted, #6c757d)' }}>
              Enter monthly income
            </small>
          </div>
          <div className="col-md-3 col-6 text-center mb-3">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #21d4a7, #1bb592)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              2
            </div>
            <h6 className="fw-semibold">Upload Expenses</h6>
            <small style={{ color: 'var(--text-muted, #6c757d)' }}>
              CSV/Excel or manual entry
            </small>
          </div>
          <div className="col-md-3 col-6 text-center mb-3">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f39c12, #e67e22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              3
            </div>
            <h6 className="fw-semibold">Review & Edit</h6>
            <small style={{ color: 'var(--text-muted, #6c757d)' }}>
              Validate your data
            </small>
          </div>
          <div className="col-md-3 col-6 text-center mb-3">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              4
            </div>
            <h6 className="fw-semibold">View Dashboard</h6>
            <small style={{ color: 'var(--text-muted, #6c757d)' }}>
              Analyze with charts
            </small>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection