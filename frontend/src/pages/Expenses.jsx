import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom"; 
import CountdownLoader from "../components/CountdownLoader";
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

          // Check same month as salary
          const salaryMonth = new Date(salary.salary_date).getMonth();
          const expenseMonth = new Date(rowDate).getMonth();
          if (salaryMonth !== expenseMonth)
            throw new Error(
              `Expense date ${rowDate} is not in the same month as salary ${salary.salary_date}`
            );

          const amt = Number(row.amount);
          if (isNaN(amt) || amt <= 0)
            throw new Error(`Invalid amount in row: ${JSON.stringify(row)}`);

          cleanedData.push({
            cate_id: categories.indexOf(cat) + 1,
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
      console.log("Expense submission response:", data);

      if (data.success) {
        setSuccess("Expenses submitted successfully! Redirecting to review...");
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

  const demoData = [
    { category: "Food & Groceries", amount: 2500, date: "2025-01-05" },
    { category: "Rent", amount: 10000, date: "2025-01-01" },
    { category: "Electricity Bill", amount: 1200, date: "2025-01-10" },
    { category: "Traveling", amount: 1500, date: "2025-01-15" },
    { category: "Entertainment", amount: 800, date: "2025-01-20" },
  ];

  if (loading) return <CountdownLoader seconds={10} />;

  return (
    <div className={`container py-5 ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Header Section */}
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-receipt-cutoff text-primary" style={{ fontSize: '3rem' }}></i>
            </div>
            <h2 className="fw-bold mb-2">Upload Your Monthly Expenses</h2>
            {user && salary && (
              <div className="mb-3">
                <p className="mb-1">Welcome back, <strong>{user.username}</strong>!</p>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <span className="badge bg-success px-3 py-2">
                    Salary: ₹{salary.amount}
                  </span>
                  <span className="badge bg-info px-3 py-2">
                    <i className="bi bi-calendar-month me-1"></i>
                    Month: {new Date(salary.salary_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Step 2 of 4</small>
              <small className="text-muted">50% Complete</small>
            </div>
            <div className="progress" style={{ height: '3px' }}>
              <div className="progress-bar bg-primary" style={{ width: '50%' }}></div>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          {/* File Upload Section */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-cloud-upload text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
                <div>
                  <h5 className="mb-1">Upload Expense File</h5>
                  <p className="text-muted mb-0">CSV or Excel format accepted</p>
                </div>
              </div>
              
              <input
                type="file"
                id="fileUpload"
                className="form-control"
                accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileUpload}
              />
              <div className="form-text mt-2">
                <i className="bi bi-info-circle me-1"></i>
                File must contain columns: <strong>category, amount, date</strong>
              </div>
            </div>
          </div>

          {/* Data Preview */}
          {expenseData.length > 0 && (
            <div className="alert alert-info mb-4">
              <i className="bi bi-file-earmark-check me-2"></i>
              <strong>{expenseData.length}</strong> expense entries validated and ready to submit.
            </div>
          )}

          {/* Submit Button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/salary-input')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Salary
            </button>
            
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!expenseData.length}
            >
              <i className="bi bi-check-circle me-2"></i>
              Submit & Continue
            </button>
          </div>

          {/* Demo Format Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0">
                <i className="bi bi-table me-2"></i>
                Required File Format
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Your CSV/Excel file must contain exactly these three columns with the correct spelling:
              </p>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th><i className="bi bi-tag me-1"></i>category</th>
                      <th><i className="bi bi-currency-rupee me-1"></i>amount</th>
                      <th><i className="bi bi-calendar3 me-1"></i>date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoData.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.category}</td>
                        <td>₹{row.amount.toLocaleString()}</td>
                        <td>{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Sidebar */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '2rem' }}>
            <div className="card-header bg-light border-0">
              <h5 className="mb-0">
                <i className="bi bi-list-check me-2"></i>
                Allowed Categories
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {categories.map((cat, idx) => (
                  <div key={idx} className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Tips */}
            <div className="card-footer bg-light border-0">
              <h6 className="mb-2">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                Quick Tips
              </h6>
              <ul className="mb-0 ps-3">
                <li><small>Use exact category names</small></li>
                <li><small>Date format: YYYY-MM-DD</small></li>
                <li><small>Amount should be positive numbers</small></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;