import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { API_URL } from "../config";

const Expenses = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  // manual entry state
  const [manualEntry, setManualEntry] = useState({
    date: "",
    category: "",
    amount: "",
  });

  const capitalize = (c) => {
    let words = c.split(' ');
    let category = "";

    words.forEach(
      word => category += word.charAt(0).toUpperCase() + word.substring(1).toLocaleLowerCase() + " "
    )
    return category.substring(0, category.length - 1)
  }

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedSalary = JSON.parse(localStorage.getItem("currentSalary"));
    if (!savedUser) navigate("/login", { replace: true });
    else setUser(savedUser);
    if (!savedSalary || !savedSalary.salary_id) navigate("/salary-input", { replace: true });
    else setSalary(savedSalary);
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/category/all`);
        const data = await res.json();
        if (!data.success || !Array.isArray(data.categories)) {
          setError("Failed to load categories");
          return;
        }
        setCategories(data.categories.map((c) => c.name.toLowerCase()));
      } catch (err) {
        setError("Failed to fetch categories from server");
      }
    };
    fetchCategories();
  }, []);

  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / 3600);
    const minutes = Math.floor(total_seconds / 60) % 60;
    date_info.setHours(hours);
    date_info.setMinutes(minutes);
    date_info.setSeconds(seconds);
    return date_info.toISOString().split("T")[0];
  };

  const handleFileUpload = (e) => {
    setError("");
    setSuccess("");
    setExpenseData([]);
    setLoading(true);

    const file = e.target.files[0];
    if (!file) {
      setLoading(false);
      return;
    }

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Only CSV or Excel files are allowed.");
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        if (!json.length) throw new Error("Uploaded file is empty.");

        const required = ["category", "amount", "date"];
        const missingCols = required.filter(
          (col) =>
            !Object.keys(json[0] || {})
              .map((k) => k.toLowerCase())
              .includes(col)
        );
        if (missingCols.length > 0)
          throw new Error(`Missing required columns: ${missingCols.join(", ")}`);

        const cleanedData = [];

        for (let row of json) {
          const cat = (row.category || "").trim().toLowerCase();
          if (!categories.includes(cat))
            throw new Error(`Invalid category found: ${row.category}`);

          let rowDate = row.date;
          if (typeof rowDate === "number") rowDate = excelDateToJSDate(rowDate);

          if (isNaN(Date.parse(rowDate)))
            throw new Error(`Invalid date format in row: ${JSON.stringify(row)}`);

          const amt = Number(row.amount);
          if (isNaN(amt) || amt <= 0)
            throw new Error(`Invalid amount in row: ${JSON.stringify(row)}`);

          cleanedData.push({
            cate_id: categories.indexOf(cat) + 1,
            category: cat,
            amount: amt,
            expense_date: rowDate,
          });
        }

        setExpenseData(cleanedData);
        setSuccess("File validated and cleaned successfully! Ready to submit.");
      } catch (err) {
        setError(err.message);
        setExpenseData([]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleManualAdd = () => {
    setError("");
    if (!manualEntry.date || !manualEntry.category || !manualEntry.amount) {
      setError("Please fill all manual entry fields.");
      return;
    }

    if (!categories.includes(manualEntry.category.toLowerCase())) {
      setError("Invalid category selected.");
      return;
    }

    const amt = Number(manualEntry.amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Invalid amount entered.");
      return;
    }

    const newEntry = {
      cate_id: categories.indexOf(manualEntry.category.toLowerCase()) + 1,
      category: manualEntry.category,
      amount: amt,
      expense_date: manualEntry.date,
    };

    setExpenseData([...expenseData, newEntry]);
    setManualEntry({ date: "", category: "", amount: "" });
    setSuccess("Entry added successfully!");
  };

  const handleSubmit = async () => {
    if (!expenseData.length) {
      setError("No valid expense data to submit.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/expense/add_bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, expenses: expenseData }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Expenses submitted successfully! Redirecting...");
        setTimeout(() => navigate("/review", { replace: true }), 2000);
        setExpenseData([]);
      } else {
        setError(data.error || "Failed to submit expenses.");
      }
    } catch (err) {
      setError("Failed to submit expenses. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <i className="bi bi-receipt-cutoff text-blue-500 text-5xl"></i>
          <h2 className="mt-3 text-2xl font-bold">Upload or Add Your Monthly Expenses</h2>
        </div>

        {/* File Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Upload Expense File</h3>
          <input
            type="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 dark:file:bg-gray-700 dark:file:text-white hover:file:bg-blue-100 dark:hover:file:bg-gray-600"
          />
          <p className="mt-2 text-sm text-gray-400">CSV or Excel with columns: category, amount, date</p>
        </div>

        {/* Manual Entry */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Expense Manually</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="date"
              value={manualEntry.date}
              onChange={(e) => setManualEntry({ ...manualEntry, date: e.target.value })}
              className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            />
            <select
              value={manualEntry.category}
              onChange={(e) => setManualEntry({ ...manualEntry, category: e.target.value })}
              className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            >
              <option value="">Select Category</option>
              {categories.map((c, idx) => (
                <option key={idx} value={capitalize(c)} className="capitalize">{capitalize(c)}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={manualEntry.amount}
              onChange={(e) => setManualEntry({ ...manualEntry, amount: e.target.value })}
              className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
          <button
            onClick={handleManualAdd}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Entry
          </button>
        </div>

        {/* Preview Entries */}
        {expenseData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Added/Validated Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.map((row, idx) => (
                    <tr key={idx} className="border-b dark:border-gray-700">
                      <td className="px-3 py-2">{row.expense_date}</td>
                      <td className="px-3 py-2 capitalize">{row.category}</td>
                      <td className="px-3 py-2">₹{row.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/salary-input")}
            className="px-4 py-2 border rounded-md bg-gray-200 dark:bg-gray-700"
          >
            Back to Salary
          </button>
          <button
            onClick={handleSubmit}
            disabled={!expenseData.length}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            Submit & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
