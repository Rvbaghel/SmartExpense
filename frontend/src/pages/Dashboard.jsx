import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import CountdownLoader from "../components/CountdownLoader";
import { API_URL } from "../config";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [user, setUser] = useState(null);
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalSalary: 0,
    totalExpenses: 0,
    remainingAmount: 0,
    expenseCount: 0
  });

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);
    console.log(savedUser)

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch charts from your Flask backend
        const chartsRes = await fetch(`${API_URL}/dashboard/charts/${savedUser.id}?month=${month}`);
        const chartsData = await chartsRes.json();

        console.log(chartsData)

        if (chartsData.success) {
          setCharts(chartsData.charts);
        } else {
          setError(chartsData.error || "Failed to load charts");
        }

        // Fetch basic stats
        const salaryRes = await fetch(`${API_URL}/salary/latest/${savedUser.id}`);

        if (salaryRes.ok) {
          const salaryData = await salaryRes.json();
          const salary = salaryData.success ? parseFloat(salaryData.salary.amount) : 0;

          let year;
          year = new Date(salaryData.salary.salary_date).getFullYear();

          const expenseRes = await fetch(`${API_URL}/expense/by_month?user_id=${savedUser.id}&month=${month}&year=${year}`);
          const expenseData = await expenseRes.json();

          const expenses = expenseData.success ? expenseData.expenses : [];
          const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

          if (expenseRes.ok) {
            setStats({
              totalSalary: salary,
              totalExpenses: totalExpenses,
              remainingAmount: salary - totalExpenses,
              expenseCount: expenses.length
            });

            console.log("Stats", stats)

          }

        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, month]);

  if (loading) return <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
    <div className="flex space-x-2">
      <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.75s]"></span>
      <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.5s]"></span>
      <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.25s]"></span>
    </div>
  </div>;

  if (error && !charts.salary_trend) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="max-w-md w-full space-y-6">
          <div className="flex items-center gap-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-xl shadow-md">
            <i className="bi bi-exclamation-triangle-fill text-xl"></i>
            <span>{error}</span>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("/salary-input")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              <i className="bi bi-plus-circle"></i>
              Add Salary & Expenses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-6 md:px-12 py-6 transition ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
        }`}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="bi bi-graph-up text-sky-500"></i>
            Financial Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <strong>{user?.username}</strong>! Here's your
            financial overview.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 md:mt-0 text-right">
          <small className="block text-gray-500 dark:text-gray-400">
            Step 4 of 4
          </small>
          <small className="block text-green-500 font-semibold">
            100% Complete!
          </small>
          <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded mt-1">
            <div className="w-full h-full bg-green-500 rounded"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Salary */}
        <div className="p-5 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <i className="bi bi-cash text-green-600 dark:text-green-400 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Salary</p>
              <h3 className="text-2xl font-bold text-green-600">
                ₹{stats.totalSalary.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="p-5 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
              <i className="bi bi-receipt text-red-600 dark:text-red-400 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-600">
                ₹{stats.totalExpenses.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className="p-5 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${stats.remainingAmount >= 0
                ? "bg-blue-100 dark:bg-blue-900"
                : "bg-yellow-100 dark:bg-yellow-900"
                }`}
            >
              <i
                className={`bi bi-wallet text-xl ${stats.remainingAmount >= 0
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-yellow-600 dark:text-yellow-400"
                  }`}
              ></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining Amount</p>
              <h3
                className={`text-2xl font-bold ${stats.remainingAmount >= 0
                  ? "text-blue-600"
                  : "text-yellow-600"
                  }`}
              >
                ₹{stats.remainingAmount.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="p-5 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-100 dark:bg-cyan-900 p-3 rounded-lg">
              <i className="bi bi-list-ul text-cyan-600 dark:text-cyan-400 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Entries</p>
              <h3 className="text-2xl font-bold text-cyan-600">
                {stats.expenseCount}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {months.map((curr_month, index) => (
          <button
            key={index}
            onClick={() => setMonth(index + 1)}
            className={`px-3 py-1.5 rounded-lg border transition ${month === index + 1
              ? "bg-sky-500 text-white border-sky-500"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-gray-700"
              }`}
          >
            {curr_month}
          </button>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-sky-500 mb-6 text-center">
        Month : {months[month - 1]}
      </h3>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.salary_vs_expense && (
          <ChartCard
            title="Salary vs Expenses"
            icon="bi-bar-chart"
            color="text-sky-500"
            src={charts.salary_vs_expense}
          />
        )}
        {charts.expense_by_category_pie && (
          <ChartCard
            title="Expenses by Category"
            icon="bi-pie-chart"
            color="text-green-500"
            src={charts.expense_by_category_pie}
          />
        )}
        {charts.salary_trend && (
          <ChartCard
            title="Salary Trend"
            icon="bi-graph-up"
            color="text-green-500"
            src={charts.salary_trend}
          />
        )}
        {charts.expense_trend && (
          <ChartCard
            title="Expense Trend"
            icon="bi-graph-down"
            color="text-red-500"
            src={charts.expense_trend}
          />
        )}
        {charts.expense_by_category_bar && (
          <ChartCard
            title="Detailed Category Breakdown"
            icon="bi-bar-chart-fill"
            color="text-cyan-500"
            src={charts.expense_by_category_bar}
            fullWidth
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h6 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
              <i className="bi bi-lightning text-yellow-500"></i>
              Quick Actions
            </h6>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your financial data
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/salary-input")}
              className="px-4 py-2 rounded-lg border border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-gray-700"
            >
              <i className="bi bi-plus-circle mr-1"></i>
              Add Salary
            </button>
            <button
              onClick={() => navigate("/expenses")}
              className="px-4 py-2 rounded-lg border border-gray-500 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <i className="bi bi-receipt mr-1"></i>
              Add Expenses
            </button>
            <button
              onClick={() => navigate("/review")}
              className="px-4 py-2 rounded-lg border border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-gray-700"
            >
              <i className="bi bi-clipboard-check mr-1"></i>
              Review Data
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg border border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-gray-700"
            >
              <i className="bi bi-arrow-clockwise mr-1"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, icon, color, src, fullWidth }) => (
  <div className={`${fullWidth ? "col-span-1 lg:col-span-2" : ""}`}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 p-4">
        <i className={`bi ${icon} ${color}`}></i>
        <h5 className="font-semibold">{title}</h5>
      </div>
      <div className="p-4">
        <img
          src={src}
          alt={title}
          className="w-full h-72 object-contain rounded-lg"
        />
      </div>
    </div>
  </div>
);


export default Dashboard;