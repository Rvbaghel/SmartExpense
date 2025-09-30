import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { API_URL } from "../config";
const Review = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const fetchData = async () => {
      setLoading(true);
      try {
        // Get latest salary
        const salaryRes = await fetch(
          `${API_URL}/salary/latest/${savedUser.id}`
        );
        const salaryData = await salaryRes.json();
        if (!salaryRes.ok || !salaryData.success) {
          setError("No salary found. Please add salary first.");
          setLoading(false);
          return;
        }
        setSalary(salaryData.salary);

        // Fetch all expenses
        const expenseRes = await fetch(`${API_URL}/expense/all`);
        const expenseData = await expenseRes.json();
        if (!expenseRes.ok || !expenseData.success) {
          setError("Failed to load expenses");
          setLoading(false);
          return;
        }

        // Filter expenses by same month as salary
        const salaryMonth = new Date(salaryData.salary.salary_date).getMonth();
        const salaryYear = new Date(salaryData.salary.salary_date).getFullYear();

        const filteredExpenses = expenseData.expenses.filter((exp) => {
          const expDate = new Date(exp.expense_date);
          return (
            expDate.getMonth() === salaryMonth &&
            expDate.getFullYear() === salaryYear
          );
        });

        setExpenses(filteredExpenses);
      } catch (err) {
        setError("Failed to load review data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirm = () => navigate("/dashboard");
  const handleEditSalary = () => navigate("/salary-input");
  const handleEditExpenses = () => navigate("/expenses");

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const remainingAmount = parseFloat(salary?.amount || 0) - totalExpenses;

  return (
    <div className={`container py-5 ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      {/* Header Section */}
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="bi bi-clipboard-check text-primary" style={{ fontSize: '3rem' }}></i>
        </div>
        <h2 className="fw-bold mb-2">Review Your Financial Data</h2>
        <p className="text-muted">Please review your salary and expenses before proceeding to dashboard</p>
      </div>

      {/* Progress Indicator */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">Step 3 of 4</small>
            <small className="text-muted">75% Complete</small>
          </div>
          <div className="progress" style={{ height: '3px' }}>
            <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Salary Summary Card */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0">
                Salary Information
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="text-muted small">User</label>
                <div className="fw-semibold">{user?.username}</div>
              </div>

              <div className="mb-3">
                <label className="text-muted small">Monthly Salary</label>
                <div className="h4 text-success mb-0">₹{salary?.amount.toLocaleString()}</div>
              </div>

              <div className="mb-3">
                <label className="text-muted small">Salary Month</label>
                <div className="fw-semibold">
                  {new Date(salary?.salary_date).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>

              <button
                className="btn btn-outline-warning btn-sm w-100"
                onClick={handleEditSalary}
              >
                <i className="bi bi-pencil me-2"></i>
                Edit Salary
              </button>
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0">
                <i className="bi bi-calculator text-primary me-2"></i>
                Financial Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Total Expenses:</span>
                    <span className="fw-semibold text-danger">₹{totalExpenses.toLocaleString()}</span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Monthly Salary:</span>
                    <span className="fw-semibold text-success">₹{salary?.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="col-12">
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Remaining Amount:</span>
                    <span className={`fw-bold ${remainingAmount >= 0 ? 'text-success' : 'text-danger'}`}>
                      ₹{remainingAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="small text-muted text-center">
                    <i className="bi bi-info-circle me-1"></i>
                    {expenses.length} expense {expenses.length === 1 ? 'entry' : 'entries'} found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0">
                <i className="bi bi-gear text-secondary me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="mb-3">
                <p className="text-muted small mb-3">
                  Review your data and make changes if needed before proceeding to the dashboard.
                </p>
              </div>

              <div className="mt-auto">
                <button
                  className="btn btn-outline-warning w-100 mb-2"
                  onClick={handleEditExpenses}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit Expenses
                </button>

                <button
                  className="btn btn-success w-100"
                  onClick={handleConfirm}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Confirm & View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-receipt text-primary me-2"></i>
                  Expense Details ({expenses.length} entries)
                </h5>
                <span className="badge bg-primary">
                  Total: ₹{totalExpenses.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              {expenses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="text-muted mt-3">No Expenses Found</h5>
                  <p className="text-muted">Add some expenses to see them here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th><i className="bi bi-tag me-1"></i>Category</th>
                        <th><i className="bi bi-currency-rupee me-1"></i>Amount</th>
                        <th><i className="bi bi-calendar3 me-1"></i>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((exp) => (
                        <tr key={exp.id}>
                          <td>
                            <span className="fw-semibold">{exp.category_name}</span>
                          </td>
                          <td>
                            <span className="text-danger fw-semibold">
                              ₹{parseFloat(exp.amount).toLocaleString()}
                            </span>
                          </td>
                          <td>
                            <span className="text-muted">
                              {new Date(exp.expense_date).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/expenses')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Expenses
            </button>

            <div className="text-muted small">
              Next: View Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;