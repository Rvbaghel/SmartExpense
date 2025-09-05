import React from 'react'

const StepCard = ({ number, title, description }) => {
  return (
    <>
      <div className="step-number mx-auto">{number}</div>
      <h4 className="fw-bold mb-3">{title}</h4>
      <p className="text-muted">{description}</p>
    </>
  )
}

export default StepCard