import React from "react"

const StepCard = ({ number, title, description }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
      {/* Number circle */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-white text-lg font-bold mb-4">
        {number}
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h4>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default StepCard
