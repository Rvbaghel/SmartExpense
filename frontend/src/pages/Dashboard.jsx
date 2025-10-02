import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";
import { format, parseISO } from "date-fns";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe",
  "#a4de6c", "#d0ed57", "#ffbb28", "#ff6f61", "#bc5090",
  "#003f5c", "#58508d", "#ffa600", "#2f4b7c", "#e15759"
];

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(
    { length: new Date().getFullYear() - 2022 + 1 },
    (_, i) => 2022 + i
  );

  // Optimized fetch with abort + debounce
  const fetchDashboardData = useCallback(async (uid, y, m, controller) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/charts/${uid}?month=${m}&year=${y}`, {
        signal: controller.signal
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load dashboard charts");

      const r = await fetch(`${API_URL}/dashboard/summary/${uid}?month=${m}&year=${y}`, {
        signal: controller.signal
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || "Failed to load dashboard summary");

      // attach summary into charts for unified access
      data.charts["monthly_expense"] = d.summary;

      setDashboardData(data);
      setError("");
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setDashboardData(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for loading data (with debounce + cancel)
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetchDashboardData(savedUser.id, year, month, controller);
    }, 400); // debounce for fast switching

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [navigate, month, year, fetchDashboardData]);

  // Transform chart data
  const {
    expenseCategoryBarData,
    expenseCategoryPieData,
    expenseTrendData,
    salaryTrendData,
    monthlyExpenseData,
    stats
  } = useMemo(() => {
    if (!dashboardData) return {};

    const charts = dashboardData.charts || {};

    return {
      // Expense by Category (Bar)
      expenseCategoryBarData:
        charts.expense_by_category_bar?.x?.map((cat, i) => ({
          category: cat,
          amount: charts.expense_by_category_bar.y[i]
        })) || [],

      // Expense by Category (Pie)
      expenseCategoryPieData:
        charts.expense_by_category_pie?.y?.map((cat, i) => ({
          name: cat,
          value: charts.expense_by_category_pie.x[i]
        })) || [],

      // Expense Trend (Line)
      expenseTrendData:
        charts.expense_trend?.x?.map((date, i) => ({
          date,
          amount: charts.expense_trend.y[i]
        })) || [],

      // Salary Trend (Line)
      salaryTrendData:
        charts.salary_trend?.x?.map((date, i) => ({
          date,
          salary: charts.salary_trend.y[i]
        })) || [],

      // Monthly Expense & Salary (from summary API)
      monthlyExpenseData:
        charts.monthly_expense?.map((entry) => ({
          month: months[entry.month - 1],
          year: entry.year,
          total_expenses: entry.total_expenses,
          total_salary: entry.total_salary,
          cumulative_expenses: entry.cumulative_expenses,
          cumulative_salary: entry.cumulative_salary
        })) || [],

      stats: {
        totalSalary: dashboardData.salary || 0,
        totalExpenses: dashboardData.total_expenses || 0,
        remainingAmount: (dashboardData.salary || 0) - (dashboardData.total_expenses || 0),
        expenseCount: dashboardData.expense_count || 0
      }
    };

  }, [dashboardData]);

  console.log(
    expenseCategoryBarData,
    expenseCategoryPieData,
    expenseTrendData,
    salaryTrendData,
    monthlyExpenseData,
    stats
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.75s]"></span>
          <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.5s]"></span>
          <span className="w-3 h-3 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.25s]"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="max-w-md w-full space-y-6">
          <div className="flex items-center gap-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-xl shadow-md">
            <i className="bi bi-exclamation-triangle-fill text-xl"></i>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 md:px-12 py-6 transition ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="bi bi-graph-up text-sky-500"></i>
            Financial Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <strong>{user?.username}</strong>! Here's your financial overview.
          </p>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex justify-center gap-3 mb-6">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-3 py-1.5 rounded-lg border transition ${year === y
              ? "bg-teal-500 text-white border-green-500"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-700"
              }`}
          >
            {y}
          </button>
        ))}
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
        {months[month - 1]} - {year}
      </h3>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Expense by Category Bar */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-500 ">Expense by Category (Bar)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseCategoryBarData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                  borderRadius: "0.5rem",
                  border: "none"
                }}
              />
              <Legend />
              <Bar dataKey="amount" fill="var(--color-sky-500)" color="var(--color-teal-500)" />
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* Expense by Category (Pie) */}
        <div className={`p-4 border rounded-lg shadow transition 
    ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-400">
            Expense by Category (Pie)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategoryPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} // tailwind gray-200 / gray-700
              >
                {expenseCategoryPieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={isDarkMode
                      ? ["#22d3ee", "#34d399", "#facc15", "#f87171", "#c084fc"][index % 5] // sky-400, green-400, yellow-400, red-400, purple-400
                      : ["#0284c7", "#059669", "#ca8a04", "#dc2626", "#9333ea"][index % 5]} // sky-600, green-600, yellow-600, red-600, purple-600
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "var(--color-gray-700)" : "#f9fafb", // dark:bg-gray-800, light:bg-gray-50
                  color: isDarkMode ? "#e5e7eb" : "#374151", // dark:text-gray-200, light:text-gray-700
                  borderRadius: "0.5rem",
                  border: "none"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Trend */}
        <div className={`p-4 border rounded-lg shadow transition 
    ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-400">
            Expense Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenseTrendData}>
              <XAxis
                dataKey="date"
                tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
                tickFormatter={(str) => format(parseISO(str), "MMM d")}
              />
              <YAxis tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                  borderRadius: "0.5rem",
                  border: "none"
                }}
                labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
              />
              <Legend wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={isDarkMode ? "#34d399" : "#059669"} // green-400 / green-600
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Salary Trend */}
        <div className={`p-4 border rounded-lg shadow transition 
    ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-400">
            Salary Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryTrendData}>
              <XAxis
                dataKey="date"
                tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
                tickFormatter={(str) => format(parseISO(str), "MMM yyyy")}
              />
              <YAxis tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                  borderRadius: "0.5rem",
                  border: "none"
                }}
                labelFormatter={(str) => format(parseISO(str), "MMM yyyy")}
              />
              <Legend wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }} />
              <Line
                type="monotone"
                dataKey="salary"
                stroke={isDarkMode ? "#f87171" : "#dc2626"} // red-400 / red-600
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Expense */}
        <div className={`p-4 border rounded-lg shadow transition col-span-1 md:col-span-2 
    ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-400">
            Monthly Expense
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyExpenseData}>
              <XAxis
                dataKey="month"
                tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
              />
              <YAxis tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                  borderRadius: "0.5rem",
                  border: "none"
                }}
              />
              <Legend wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }} />
              <Bar
                dataKey="total"
                fill={isDarkMode ? "#22d3ee" : "#0284c7"} // sky-400 / sky-600
              />
            </BarChart>
          </ResponsiveContainer>
        </div>



      </div>
    </div>
  );
};

export default Dashboard;
