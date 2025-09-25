import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import CountdownLoader from "../components/CountdownLoader";

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    setUser(savedUser);

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch charts from your Flask backend
        const chartsRes = await fetch(`http://localhost:5000/dashboard/charts/${savedUser.id}`);
        const chartsData = await chartsRes.json();
        
        if (chartsData.success) {
          setCharts(chartsData.charts);
        } else {
          setError(chartsData.error || "Failed to load charts");
        }

        // Fetch basic stats
        const salaryRes = await fetch(`http://localhost:5000/salary/latest/${savedUser.id}`);
        const expenseRes = await fetch("http://localhost:5000/expense/all");
        
        if (salaryRes.ok && expenseRes.ok) {
          const salaryData = await salaryRes.json();
          const expenseData = await expenseRes.json();
          
          const salary = salaryData.success ? parseFloat(salaryData.salary.amount) : 0;
          const expenses = expenseData.success ? expenseData.expenses : [];
          const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
          
          setStats({
            totalSalary: salary,
            totalExpenses: totalExpenses,
            remainingAmount: salary - totalExpenses,
            expenseCount: expenses.length
          });
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return <CountdownLoader seconds={10} />;

  if (error && !charts.salary_trend) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
            <div className="text-center">
              <button className="btn btn-primary" onClick={() => navigate("/salary-input")}>
                <i className="bi bi-plus-circle me-2"></i>
                Add Salary & Expenses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-fluid py-4 ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold mb-1">
                <i className="bi bi-graph-up text-primary me-2"></i>
                Financial Dashboard
              </h1>
              <p className="text-muted mb-0">
                Welcome back, <strong>{user?.username}</strong>! Here's your financial overview.
              </p>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-end">
              <small className="text-muted d-block">Step 4 of 4</small>
              <small className="text-success fw-semibold">100% Complete!</small>
              <div className="progress mt-1" style={{ width: '120px', height: '3px' }}>
                <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4 g-3">
        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded p-2">
                    <i className="bi bi-currency-dollar text-success fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Total Salary</div>
                  <div className="h4 mb-0 text-success">₹{stats.totalSalary.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-danger bg-opacity-10 rounded p-2">
                    <i className="bi bi-receipt text-danger fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Total Expenses</div>
                  <div className="h4 mb-0 text-danger">₹{stats.totalExpenses.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className={`${stats.remainingAmount >= 0 ? 'bg-primary' : 'bg-warning'} bg-opacity-10 rounded p-2`}>
                    <i className={`bi bi-wallet ${stats.remainingAmount >= 0 ? 'text-primary' : 'text-warning'} fs-4`}></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Remaining Amount</div>
                  <div className={`h4 mb-0 ${stats.remainingAmount >= 0 ? 'text-primary' : 'text-warning'}`}>
                    ₹{stats.remainingAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded p-2">
                    <i className="bi bi-list-ul text-info fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Total Entries</div>
                  <div className="h4 mb-0 text-info">{stats.expenseCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row g-4">
        {/* Salary vs Expense */}
        {charts.salary_vs_expense && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="bi bi-bar-chart text-primary me-2"></i>
                  Salary vs Expenses
                </h5>
              </div>
              <div className="card-body p-3">
                <img 
                  src={charts.salary_vs_expense} 
                  alt="Salary vs Expenses Chart" 
                  className="img-fluid w-100"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expense by Category Pie */}
        {charts.expense_by_category_pie && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="bi bi-pie-chart text-success me-2"></i>
                  Expenses by Category
                </h5>
              </div>
              <div className="card-body p-3">
                <img 
                  src={charts.expense_by_category_pie} 
                  alt="Expenses by Category Pie Chart" 
                  className="img-fluid w-100"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Salary Trend */}
        {charts.salary_trend && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="bi bi-graph-up text-success me-2"></i>
                  Salary Trend
                </h5>
              </div>
              <div className="card-body p-3">
                <img 
                  src={charts.salary_trend} 
                  alt="Salary Trend Chart" 
                  className="img-fluid w-100"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expense Trend */}
        {charts.expense_trend && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="bi bi-graph-down text-danger me-2"></i>
                  Expense Trend
                </h5>
              </div>
              <div className="card-body p-3">
                <img 
                  src={charts.expense_trend} 
                  alt="Expense Trend Chart" 
                  className="img-fluid w-100"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Category Bar Chart */}
        {charts.expense_by_category_bar && (
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0">
                  <i className="bi bi-bar-chart-fill text-info me-2"></i>
                  Detailed Category Breakdown
                </h5>
              </div>
              <div className="card-body p-3">
                <img 
                  src={charts.expense_by_category_bar} 
                  alt="Expenses by Category Bar Chart" 
                  className="img-fluid w-100"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h6 className="mb-1">
                    <i className="bi bi-lightning text-warning me-2"></i>
                    Quick Actions
                  </h6>
                  <small className="text-muted">Manage your financial data</small>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/salary-input")}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Salary
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/expenses")}
                  >
                    <i className="bi bi-receipt me-1"></i>
                    Add Expenses
                  </button>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => navigate("/review")}
                  >
                    <i className="bi bi-clipboard-check me-1"></i>
                    Review Data
                  </button>
                  <button 
                    className="btn btn-outline-info btn-sm"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;