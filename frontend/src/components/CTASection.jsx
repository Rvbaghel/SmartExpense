import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* 🖼️ Image / Illustration */}
        <div className="flex justify-center md:justify-start w-full md:w-1/3">
          <img
            src="logo.png"
            alt="SmartExpense Logo"
            className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-md 
            transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* 🧠 Text and Buttons */}
        <div className="text-center md:text-left w-full md:w-2/3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-snug">
            Ready to Master Your Money?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
            Join thousands who’ve taken control of their finances with SmartExpense.
            Start your journey to financial freedom today.
          </p>

          {/* 🚀 Action Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              to="/earning"
              className="px-6 py-3 text-lg rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white shadow-md hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 
              active:scale-95 transition-all duration-200 flex items-center gap-2 no-underline"
            >
              Get Started
              <i className="bi bi-rocket-fill text-white text-xl"></i>
            </Link>

            <Link
              to="/about"
              className="px-6 py-3 text-lg rounded-xl font-medium border border-gray-400 dark:border-gray-600 
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm 
              hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 
              transition-all duration-200 flex items-center gap-2 no-underline"
            >
              Learn More
              <i className="bi bi-info-circle-fill text-blue-500 dark:text-blue-400 text-xl"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
