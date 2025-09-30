import React from 'react'
import { Link } from 'react-router-dom'

const FeatureCard = ({ icon, iconClass, title, description, link, linkText }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300 hover:shadow-lg">
      <div className={`mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700 ${iconClass}`}>
        <i className={`${icon} text-white text-xl `}></i>
      </div>
      <h4 className="font-semibold text-lg mb-2 dark:text-gray-100">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
      <Link
        to={link}
        className="inline-flex items-center mt-4 px-3 py-1.5 border border-blue-600 text-blue-600 dark:text-blue-300 dark:border-blue-300 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors no-underline"
      >
        {linkText} <i className="bi bi-arrow-right ms-1 ml-1"></i>
      </Link>
    </div>
  )
}

export default FeatureCard
