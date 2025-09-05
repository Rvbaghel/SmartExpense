import React from 'react'
import StepCard from './StepCard'

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Input Your Salary',
      description: 'Add your income sources, including base salary, bonuses, and other earnings. Set up once, track forever.'
    },
    {
      number: 2,
      title: 'Track Daily Expenses',
      description: 'Log expenses manually or upload CSV files. Automatic categorization saves you time and effort.'
    },
    {
      number: 3,
      title: 'Analyze Patterns',
      description: 'View interactive charts and insights. Understand where your money goes and identify improvement areas.'
    },
    {
      number: 4,
      title: 'Optimize & Save',
      description: 'Follow AI-powered recommendations to cut waste, increase savings, and achieve your financial goals.'
    }
  ]

  return (
    <section className="steps-section utility-py-6" id="how-it-works">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">How It Works</h2>
            <p className="lead text-muted">
              Get started in minutes. Financial control in days. Life-changing results in months.
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
      </div>
    </section>
  )
}

export default HowItWorksSection