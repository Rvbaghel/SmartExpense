import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative py-16 lg:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 items-center min-h-[75vh] gap-12">
          {/* Left Content */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
              Take Control of Your <br />
              <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                SmartExpense
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 opacity-90 mb-6">
              Simple and powerful expense tracking. Add your monthly earning, upload
              expenses via CSV, and get beautiful insights about your spending
              habits. No complexity, just results.
            </p>

            {/* Key Benefits */}
            <div className="space-y-3 mb-6">
              {[
                "CSV/Excel bulk upload support",
                "Beautiful charts and analytics",
                "Smart spending recommendations",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-green-500 mr-3 flex-shrink-0">
                    <i className="bi bi-check text-white text-[10px] sm:text-xs"></i>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/earning"
                className="px-5 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors no-underline text-sm sm:text-base"
              >
                Get Started
              </Link>
              <Link
                to="/expenses"
                className="px-5 sm:px-6 py-3 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 font-semibold rounded-lg shadow-md transition-colors no-underline text-sm sm:text-base"
              >
                Upload CSV
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <i className="bi bi-shield-check text-green-600 mr-2"></i>
                  Secure & Private
                </div>
                <div className="flex items-center">
                  <i className="bi bi-cloud-upload text-blue-500 mr-2"></i>
                  Easy CSV Upload
                </div>
                <div className="flex items-center">
                  <i className="bi bi-graph-up-arrow text-green-600 mr-2"></i>
                  Real-time Analytics
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Section */}
          <div className="relative flex justify-center mt-10 lg:mt-0">
            {/* Floating Background Elements */}
            <div className="absolute top-[20%] left-[5%] sm:left-[10%] w-12 sm:w-20 h-12 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 opacity-10 animate-float"></div>
            <div className="absolute bottom-[15%] right-[5%] sm:right-[15%] w-10 sm:w-16 h-10 sm:h-16 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 opacity-10 animate-float-reverse"></div>

            {/* Dashboard Card */}
            <div className="relative inline-block p-6 sm:p-8 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl transition-all duration-300 w-full max-w-[300px] sm:max-w-[288px]">
              <div className="w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-400 text-white relative overflow-hidden flex flex-col items-center justify-center gap-3 sm:gap-4">
                {/* Top Bar */}
                <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 h-8 sm:h-10 bg-white/20 rounded-lg px-2 sm:px-3 flex items-center justify-between text-[10px] sm:text-sm font-semibold">
                  <span>Monthly Overview</span>
                  <i className="bi bi-three-dots"></i>
                </div>

                {/* Center Info */}
                <div className="text-center mt-3 sm:mt-4">
                  <i className="bi bi-bar-chart-line text-4xl sm:text-5xl mb-2 sm:mb-3"></i>
                  <div className="text-xl sm:text-2xl font-bold">₹45,000</div>
                  <div className="text-[10px] sm:text-sm opacity-90">Total Expenses This Month</div>
                </div>

                {/* Bottom Stats */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-5 right-3 sm:right-5 flex justify-between text-[8px] sm:text-xs">
                  <div className="text-center">
                    <div className="opacity-80">Earning</div>
                    <div className="font-semibold text-xs sm:text-sm">₹80K</div>
                  </div>
                  <div className="text-center">
                    <div className="opacity-80">Saved</div>
                    <div className="font-semibold text-xs sm:text-sm">₹35K</div>
                  </div>
                  <div className="text-center">
                    <div className="opacity-80">Categories</div>
                    <div className="font-semibold text-xs sm:text-sm">8</div>
                  </div>
                </div>
              </div>

              {/* Floating Green Check */}
              <div className="absolute -top-2 -right-2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
                <i className="bi bi-check-lg text-sm sm:text-base"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float 8s ease-in-out infinite reverse;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
