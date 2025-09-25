import React from 'react'
import StepCard from './StepCard'

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Add Monthly Salary',
      description: 'Enter your monthly salary amount. Simple one-time setup for each month to track your income.'
    },
    {
      number: 2,
      title: 'Upload Your Expenses',
      description: 'Upload expenses via CSV/Excel file or add them manually. Link expenses to specific months and categories.'
    },
    {
      number: 3,
      title: 'Review & Validate',
      description: 'Check your uploaded data, edit if needed, and ensure all expenses are properly categorized before finalizing.'
    },
    {
      number: 4,
      title: 'View Analytics Dashboard',
      description: 'See beautiful charts showing salary vs expenses, spending by category, and monthly trends to make informed decisions.'
    }
  ]

  return (
    <section className="steps-section utility-py-6" id="how-it-works">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">How SmartExpense Works</h2>
            <p className="lead text-muted">
              Four simple steps to take control of your finances. Get insights in minutes, not hours.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {steps.map((step, index) => (
            <div key={index} className="col-md-6 col-lg-3 text-center">
              <StepCard {...step} />
            </div>
          ))}
        </div>
        
        {/* Simple workflow illustration */}
        <div className="row mt-5 pt-4">
          <div className="col-12 text-center">
            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center">
                <span className="badge bg-primary rounded-pill px-3 py-2">Salary</span>
                <i className="bi bi-arrow-right mx-3 text-muted"></i>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-secondary rounded-pill px-3 py-2">Expenses</span>
                <i className="bi bi-arrow-right mx-3 text-muted"></i>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-success rounded-pill px-3 py-2">Review</span>
                <i className="bi bi-arrow-right mx-3 text-muted"></i>
              </div>
              <span className="badge bg-warning rounded-pill px-3 py-2">Dashboard</span>
            </div>
            <p className="text-muted mt-3 mb-0">
              <small>Complete workflow in under 5 minutes</small>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection