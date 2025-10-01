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

  // years from 2022 → current
  const years = Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i);

  // fetch data optimized
  const fetchDashboardData = useCallback(async (uid, y, m) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/charts/${uid}?month=${m}&year=${y}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load dashboard data");
      }

      setDashboardData(data);

      setError("");
    } catch (err) {
      setError(err.message);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load once + when month/year changes
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const timeout = setTimeout(() => {
      fetchDashboardData(savedUser.id, year, month);
    }, 300); // debounce API calls on fast switching

    return () => clearTimeout(timeout);
  }, [navigate, month, year, fetchDashboardData]);

  // Transform chart data only when dashboardData changes
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
    console.log(charts)



    return {
      // 1. Expense by Category (Bar)
      expenseCategoryBarData: charts.expense_by_category_bar?.x?.map((cat, i) => ({
        category: cat,
        amount: charts.expense_by_category_bar.y[i]
      })) || [],

      // 2. Expense by Category (Pie)
      expenseCategoryPieData: charts.expense_by_category_pie?.y?.map((cat, i) => ({
        name: cat,
        value: charts.expense_by_category_pie.x[i]
      })) || [],

      // 3. Expense Trend (Line)
      expenseTrendData: charts.expense_trend?.x?.map((date, i) => ({
        date,
        amount: charts.expense_trend.y[i]
      })) || [],

      // 4. Salary Trend (Line)
      salaryTrendData: charts.salary_trend?.x?.map((date, i) => ({
        date,
        salary: charts.salary_trend.y[i]
      })) || [],

      // 5. Monthly Expense (backend can send directly, otherwise compute)
      monthlyExpenseData: charts.monthly_expense || [],

      stats: {
        totalSalary: dashboardData.salary || 0,
        totalExpenses: dashboardData.total_expenses || 0,
        remainingAmount: (dashboardData.salary || 0) - (dashboardData.total_expenses || 0),
        expenseCount: dashboardData.expense_count || 0
      }
    };


  }, [dashboardData]);

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
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="var(--color-sky-500)" color="var(--color-teal-500)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by Category Pie */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-500 ">Expense by Category (Pie)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategoryPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {expenseCategoryPieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Trend */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-500 ">Expense Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenseTrendData}>
              <XAxis dataKey="date" tickFormatter={(str) => format(parseISO(str), "MMM d")} />
              <YAxis />
              <Tooltip labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Salary Trend */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-500 ">Salary Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryTrendData}>
              <XAxis dataKey="date" tickFormatter={(str) => format(parseISO(str), "MMM yyyy")} />
              <YAxis />
              <Tooltip labelFormatter={(str) => format(parseISO(str), "MMM yyyy")} />
              <Legend />
              <Line type="monotone" dataKey="salary" stroke="#ff8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Expense */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800 col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2 text-sky-500 dark:text-teal-500 ">Monthly Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseCategoryBarData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#003f5c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
