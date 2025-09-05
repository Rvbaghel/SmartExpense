import React from 'react'
import { Link } from 'react-router-dom'
import FeatureCard from './FeatureCard'

const FeaturesSection = () => {
  const features = [
    {
      icon: 'bi-cash-stack',
      iconClass: 'icon-salary',
      title: 'Salary Management',
      description: 'Input and track multiple income sources. Handle bonuses, deductions, and complex pay structures with ease.',
      link: '/salary-input',
      linkText: 'Manage Salary'
    },
    {
      icon: 'bi-receipt',
      iconClass: 'icon-expense',
      title: 'Expense Tracking',
      description: 'Manual entry or bulk CSV upload. Categorize spending automatically and identify patterns instantly.',
      link: '/expenses',
      linkText: 'Track Expenses'
    },
    {
      icon: 'bi-graph-up-arrow',
      iconClass: 'icon-dashboard',
      title: 'Interactive Dashboard',
      description: 'Real-time visualizations, spending trends, and financial health metrics. See your money flow clearly.',
      link: '/dashboard',
      linkText: 'View Dashboard'
    },
    {
      icon: 'bi-robot',
      iconClass: 'icon-ai',
      title: 'AI Recommendations',
      description: 'Smart predictions and personalized saving strategies. Get actionable insights to optimize your finances.',
      link: '/dashboard',
      linkText: 'Get Insights'
    }
  ]

  return (
    <section className="utility-py-6" id="features">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Everything You Need to Win Financially</h2>
            <p className="lead text-muted">
              Comprehensive tools designed for modern financial management. No spreadsheets, no complexity—just results.
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
      </div>
    </section>
  )
}

export default FeaturesSection