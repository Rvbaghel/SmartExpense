import React from "react";

const About = () => {
  const developers = [
    {
      name: "Vishal Baghel",
      role: "Full Stack Developer",
      description: "Master's Student | Full Stack Developer",
      image: "https://scontent.famd4-1.fna.fbcdn.net/v/t39.30808-1/272084725_221920496811216_4621164308017724374_n.jpg?stp=c0.5000x0.5000f_dst-jpg_e15_p192x192_q65_tt6_u&efg=eyJ1cmxnZW4iOiJ1cmxnZW5fZnJvbV91cmwifQ&_nc_cid=0&_nc_ad=z-m&_nc_rml=0&_nc_ht=scontent.famd4-1.fna&_nc_cat=101&_nc_ohc=vIUAUEubt9gQ7kNvwHNETGm&_nc_gid=4b87UX9XC-K1_-jvA-n6ug&ccb=1-7&_nc_sid=28885b&oh=00_AfbwB2g36NDD9zyT2w0L7CfklA79KbhoeP6P44u10XdwYQ&oe=68E1D1E6",
      github: "https://github.com/Rvbaghel",
      linkedin: "https://in.linkedin.com/in/vishal-baghel-a055b5249",
      email: "baghelvishal264@gmail.com",
    },
    {
      name: "Krish Shah",
      role: "Full Stack Developer",
      description: "React Enthusiast & Backend Experience",
      image: "https://avatars.githubusercontent.com/u/133616289?v=4",
      github: "https://github.com/inj-krish19",
      linkedin: "https://www.linkedin.com/in/inj-krish19/",
      email: "kglivee19@gmail.com",
    },
    {
      name: "Parshwa Shah",
      role: "Frontend Developer",
      description: "API & Database Expert",
      image: "https://cdn-icons-png.flaticon.com/512/219/219970.png",
      github: "https://github.com/parshwa016",
      linkedin: "https://linkedin.com/",
      email: "parshwa016@gmail.com",
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        {/* About Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text mb-4">
            About SmartExpense
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
            Simple and powerful personal finance management made easy.
          </p>
        </div>

        {/* How It Works */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Purpose
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              SmartExpense is a personal finance application designed to help you track your monthly salary and expenses effortlessly. Analyze your spending patterns, visualize your financial data, and make informed decisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Key Features
            </h2>
            <ul className="space-y-2">
              {[
                "Monthly salary tracking",
                "CSV/Excel expense upload",
                "Manual expense entry",
                "Category-wise expense tracking",
                "Interactive dashboard with charts",
                "Spending trend analysis",
              ].map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                  <i className="bi bi-check-circle-fill text-green-500 mr-2"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              How It Works
            </h2>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                  ${step === 1 ? "bg-blue-500" :
                    step === 2 ? "bg-gray-500" :
                      step === 3 ? "bg-green-500" :
                        "bg-yellow-400 text-black"}`}>
                  {step}
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white">
                    {step === 1
                      ? "Add Monthly Salary"
                      : step === 2
                        ? "Upload Expenses"
                        : step === 3
                          ? "Review & Validate"
                          : "Analyze Dashboard"}
                  </strong>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {step === 1
                      ? "Enter your monthly income to start tracking"
                      : step === 2
                        ? "Bulk upload via CSV/Excel or add manually"
                        : step === 3
                          ? "Check and edit your data before finalizing"
                          : "View charts and insights about your spending"}
                  </p>
                </div>
              </div>
            ))}

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6">
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {["JavaScript", "React+Vite", "Python", "Flask", "PostgreSQL", "Bootstrap"].map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Developers Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet the Developers</h2>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-8">
          {developers.map((dev, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{dev.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{dev.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{dev.description}</p>
              <div className="flex gap-3">
                <a href={dev.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 hover:text-blue-500 transition text-xl">
                  <i className="bi bi-github"></i>
                </a>
                <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-500 transition text-xl">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href={`mailto:${dev.email}`} className="text-red-500 hover:text-red-400 transition text-xl">
                  <i className="bi bi-envelope"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
