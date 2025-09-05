import React from 'react'
import { Link } from 'react-router-dom'

const FeatureCard = ({ icon, iconClass, title, description, link, linkText }) => {
  return (
    <div className="feature-card">
      <div className={`feature-icon ${iconClass}`}>
        <i className={`${icon} text-white`}></i>
      </div>
      <h4 className="fw-bold mb-3">{title}</h4>
      <p className="text-muted">{description}</p>
      <Link to={link} className="btn btn-sm btn-outline-primary mt-3">
        {linkText} <i className="bi bi-arrow-right ms-1"></i>
      </Link>
    </div>
  )
}

export default FeatureCard