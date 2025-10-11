import React from "react";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: "bi-currency-dollar",
      iconClass: "icon-earning",
      title: "Monthly earning Tracking",
      description:
        "Add and manage your monthly earning easily. Track your income month by month to understand your earnings pattern.",
      link: "/earning",
      linkText: "Add earning",
    },
    {
      icon: "bi-receipt-cutoff",
      iconClass: "icon-expense",
      title: "Smart Expense Management",
      description:
        "Upload expenses via CSV/Excel or add manually. Categorize your spending and link expenses to specific months.",
      link: "/expenses",
      linkText: "Add Expenses",
    },
    {
      icon: "bi-bar-chart-line",
      iconClass: "icon-dashboard",
      title: "Visual Analytics Dashboard",
      description:
        "View beautiful charts showing earning vs expenses, category breakdowns, and spending trends over time.",
      link: "/dashboard",
      linkText: "View Analytics",
    },
    {
      icon: "bi-lightbulb",
      iconClass: "icon-ai",
      title: "Smart Insights",
      description:
        "Get personalized recommendations based on your spending patterns to improve your financial health.",
      link: "/dashboard",
      linkText: "Get Insights",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Add Earning",
      desc: "Enter monthly income",
      bg: "from-blue-500 to-blue-700",
    },
    {
      number: "2",
      title: "Upload Expenses",
      desc: "CSV/Excel or manual entry",
      bg: "from-teal-400 to-emerald-600",
    },
    {
      number: "3",
      title: "Review & Edit",
      desc: "Validate your data",
      bg: "from-amber-400 to-orange-500",
    },
    {
      number: "4",
      title: "View Dashboard",
      desc: "Analyze with charts",
      bg: "from-purple-500 to-violet-700",
    },
  ];

  return (
    <section
      id="features"
      className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-gray-500 bg-clip-text text-transparent">
            Simple Finance Management Made Easy
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track your earning and expenses effortlessly. Upload CSV files,
            visualize your spending, and make informed financial decisions with
            SmartExpense.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Quick Steps Section */}
        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              How SmartExpense Works
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.bg} flex items-center justify-center text-white text-xl font-bold mb-3`}
                >
                  {step.number}
                </div>
                <h6 className="font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h6>
                <small className="text-gray-600 dark:text-gray-400">
                  {step.desc}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
