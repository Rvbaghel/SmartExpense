import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Ready to Master Your Money?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Join thousands who've taken control of their finances. Start your
          journey to financial freedom today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/salary-input"
            className="px-6 py-3 text-lg rounded-2xl font-medium bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 no-underline"
          >
            Get Started Now
            <i className="bi bi-rocket"></i>
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 text-lg rounded-2xl font-medium border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 no-underline"
          >
            Learn More
            <i className="bi bi-info-circle"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
