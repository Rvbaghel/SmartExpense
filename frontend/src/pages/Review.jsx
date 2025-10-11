import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { API_URL } from "../config";

const Review = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [earning, setEarning] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchData = async () => {

      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser) {
        navigate("/login");
        return;
      }
      setUser(savedUser);
      console.log("User", user)
      setLoading(true);
      try {
        // Latest earning
        const earningRes = await fetch(`${API_URL}/earning/latest/${savedUser.id}`);
        const earningData = await earningRes.json();

        if (!earningRes.ok || !earningData.success) {
          setError("No earning found. Please add earning first.");
          setLoading(false);
          return;
        }
        setEarning(earningData.earning);

        // Expenses
        const expenseRes = await fetch(`${API_URL}/expense/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: savedUser.id
          })
        });
        const expenseData = await expenseRes.json();

        if (!expenseRes.ok || !expenseData.success) {
          setError("Failed to load expenses", expenseData);
          console.log("Failed to load expenses", expenseData);
          setLoading(false);
          return;
        }

        // Filter by earning month
        const earningMonth = new Date(earningData.earning.earning_date).getMonth();
        const earningYear = new Date(earningData.earning.earning_date).getFullYear();

        const filtered = expenseData.expenses.filter((exp) => {
          const expDate = new Date(exp.expense_date);
          return expDate.getMonth() === earningMonth && expDate.getFullYear() === earningYear;
        });

        setExpenses(filtered);
      } catch (err) {
        setError("Failed to load review data.");
        console.log("Failed to load review data.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200 px-4 py-3 rounded-lg flex items-center shadow-md">
          <i className="bi bi-exclamation-triangle-fill mr-2"></i>
          {error}
        </div>
      </div>
    );
  }

  const handleConfirm = () => navigate("/dashboard");
  const handleEditEarning = () => navigate("/earning");
  const handleEditExpenses = () => navigate("/expenses");

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const remainingAmount = parseFloat(earning?.amount || 0) - totalExpenses;

  return (
    <div className={`py-8 px-4 sm:px-8 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <i className="bi bi-clipboard-check text-blue-500 text-5xl mb-3"></i>
        <h2 className="text-2xl font-bold">Review Your Financial Data</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please review your earning and expenses before proceeding to dashboard
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
          <span>Step 3 of 4</span>
          <span>75% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* earning Info */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h5 className="font-semibold mb-3">earning Information</h5>
          <p className="text-sm text-gray-500">User: <span className="font-semibold">{user?.username}</span></p>
          <p className="text-sm text-gray-500 mt-2">Monthly earning:</p>
          <p className="text-green-600 text-xl font-bold">₹{earning?.amount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">earning Month:</p>
          <p className="font-medium">
            {new Date(earning?.earning_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <button
            onClick={handleEditEarning}
            className="mt-4 w-full px-3 py-2 rounded-md text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-700 dark:text-white"
          >
            <i className="bi bi-pencil mr-2"></i> Edit earning
          </button>
        </div>

        {/* Financial Summary */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h5 className="font-semibold mb-3 flex items-center">
            <i className="bi bi-calculator text-blue-500 mr-2"></i> Financial Summary
          </h5>
          <div className="flex justify-between mb-2">
            <span>Total Expenses:</span>
            <span className="text-red-500 font-semibold">₹{totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Monthly earning:</span>
            <span className="text-green-500 font-semibold">₹{earning?.amount.toLocaleString()}</span>
          </div>
          <hr className="my-2 border-gray-300 dark:border-gray-600" />
          <div className="flex justify-between">
            <span className="font-bold">Remaining Amount:</span>
            <span className={`font-bold ${remainingAmount >= 0 ? "text-green-500" : "text-red-500"}`}>
              ₹{remainingAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            {expenses.length} expense {expenses.length === 1 ? "entry" : "entries"} found
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col">
          <h5 className="font-semibold mb-3 flex items-center">
            <i className="bi bi-gear text-gray-500 mr-2"></i> Quick Actions
          </h5>
          <p className="text-sm text-gray-500 mb-4">
            Review your data and make changes if needed before proceeding to the dashboard.
          </p>
          <button
            onClick={handleEditExpenses}
            className="w-full mb-2 px-3 py-2 rounded-md text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-700 dark:text-white"
          >
            <i className="bi bi-pencil mr-2"></i> Edit Expenses
          </button>
          <button
            onClick={handleConfirm}
            className="w-full px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
          >
            <i className="bi bi-check-circle mr-2"></i> Confirm & View Dashboard
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h5 className="font-semibold flex items-center">
            <i className="bi bi-receipt text-blue-500 mr-2"></i>
            Expense Details ({expenses.length} entries)
          </h5>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            Total: ₹{totalExpenses.toLocaleString()}
          </span>
        </div>
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <i className="bi bi-inbox text-5xl mb-3"></i>
            <h5>No Expenses Found</h5>
            <p className="text-sm">Add some expenses to see them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 font-medium">{exp.category_name}</td>
                    <td className="px-4 py-2 text-red-500 font-semibold">₹{parseFloat(exp.amount).toLocaleString()}</td>
                    <td className="px-4 py-2 text-gray-500">{new Date(exp.expense_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => navigate("/expenses")}
          className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <i className="bi bi-arrow-left mr-2"></i> Back to Expenses
        </button>
        <span className="text-sm text-gray-500">Next: View Dashboard</span>
      </div>
    </div>
  );
};

export default Review;
