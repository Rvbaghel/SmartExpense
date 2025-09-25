import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import CountdownLoader from "../components/CountdownLoader"; // ✅ import loader
import { API_URL } from "../config";

const SalaryInput = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [salaryDate, setSalaryDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loader state

  // Check if user is logged in
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
    } else {
      setUser(savedUser);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || !salaryDate) {
      setError("Please fill in all fields.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    try {
      setLoading(true); // ✅ start loader
      const fullDate = salaryDate + "-01"; // convert YYYY-MM -> YYYY-MM-DD
      const res = await fetch(`${API_URL}/salary/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          salary_date: fullDate,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "currentSalary",
          JSON.stringify({
            salary_id: result.salary.id,
            amount: result.salary.amount,
            salary_date: result.salary.salary_date,
          })
        );
        setSuccess("Salary added successfully!");
        navigate("/expenses");
      } else {
        setError(result.error || "Failed to add salary");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  if (!user) return null; // prevent rendering before user check

  // ✅ show countdown while loading
  if (loading) return <CountdownLoader seconds={10} />;

  return (
    <div className={`container py-5 ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="feature-card p-4">
            <h2 className="mb-3">Welcome, {user.username}</h2>
            <p className="mb-4">Enter your salary for the month:</p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Salary Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="salaryDate" className="form-label">
                  Salary Date
                </label>
                <input
                  type="month"
                  id="salaryDate"
                  className="form-control"
                  value={salaryDate}
                  onChange={(e) => setSalaryDate(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Submit Salary
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryInput;
