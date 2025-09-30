import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="utility-py-6 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        {/* Top content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Intro */}
          <div>
            <div className="mb-3">
              <span className="text-xl font-bold text-sky-600 dark:text-teal-400">
                SmartExpense
              </span>
            </div>
            <p className="text-sm mb-3">
              Simple personal finance management for everyone. Track your
              monthly salary and expenses with beautiful analytics to make better
              financial decisions.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="mailto:baghelvishal264@gmail.com"
                aria-label="Email contact"
                className="no-underline"
              >
                <i className="bi bi-envelope mr-1"></i>Contact
              </a>
              <Link to="/about" aria-label="About page" className="no-underline">
                About
              </Link>
              <a href="#features" aria-label="Features section" className="no-underline">
                Features
              </a>
            </div>
          </div>

          {/* Quick Start */}
          <div>
            <h6 className="font-bold mb-3 text-gray-900 dark:text-gray-100">
              Quick Start
            </h6>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/salary-input" className="no-underline">
                Add Salary
              </Link>
              <Link to="/expenses" className="no-underline">
                Upload Expenses
              </Link>
              <Link to="/dashboard" className="no-underline">
                View Dashboard
              </Link>
              <Link to="/profile" className="no-underline">
                My Profile
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h6 className="font-bold mb-3 text-gray-900 dark:text-gray-100">
              Resources
            </h6>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/about" className="no-underline">
                About SmartExpense
              </Link>
              <a href="#how-it-works" className="no-underline">
                How It Works
              </a>
              <a
                href="https://github.com/Rvbaghel"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                Source Code
              </a>
              <a href="mailto:baghelvishal264@gmail.com" className="no-underline">
                Support
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h6 className="font-bold mb-3 text-gray-900 dark:text-gray-100">
              Get In Touch
            </h6>
            <p className="text-sm mb-3">
              Have questions about SmartExpense? Reach out to the developer.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="mailto:baghelvishal264@gmail.com"
                className="flex items-center text-sky-600 dark:text-teal-400 no-underline"
              >
                <i className="bi bi-envelope mr-2"></i>
                baghelvishal264@gmail.com
              </a>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <i className="bi bi-geo-alt mr-2"></i>
                Gujarat University, India
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* Bottom content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
            {new Date().getFullYear()} SmartExpense by{" "}
            <strong className="text-sky-600 dark:text-teal-400">
              Vishal Baghel
            </strong>
            . Built for better financial management.
          </p>
          <div className="flex gap-3">
            {[
              {
                href: "https://github.com/Rvbaghel",
                icon: "bi-github",
                bg: "bg-gray-900",
              },
              {
                href: "https://in.linkedin.com/in/vishal-baghel-a055b5249",
                icon: "bi-linkedin",
                bg: "bg-[#0A66C2]",
              },
              {
                href: "mailto:baghelvishal264@gmail.com",
                icon: "bi-envelope",
                bg: "bg-red-600",
              },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${item.bg} transform transition-transform duration-200 hover:-translate-y-1`}
                aria-label={item.icon}
              >
                <i className={`bi ${item.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
