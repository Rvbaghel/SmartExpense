import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import CountdownLoader from "../components/CountdownLoader"; // ✅ import

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ start countdown

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log("Login response:", result);

      if (res.ok) {
        login(result.user);
        navigate("/"); // redirect to dashboard/home
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false); // ✅ stop countdown
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      {/* ✅ Countdown overlay */}
      {loading && <CountdownLoader seconds={10} />}

      <div className="feature-card" style={{ width: "100%", maxWidth: "420px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "var(--bs-primary)" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
