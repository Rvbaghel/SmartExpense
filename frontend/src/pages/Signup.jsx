import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    password: "",
    repassword: "",
    bio: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    const { email, username, phone, password, repassword } = formData;

    if (!email || !username || !phone || !password || !repassword) {
      return "All fields are required!";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format!";

    const usernameRegex = /^[A-Za-z0-9_]+$/;
    if (!usernameRegex.test(username))
      return "Username can only contain letters, numbers, and underscore (_)";

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) return "Phone number must be 10 digits!";

    const passwordRegex = /^[0-9]{4,}$/;
    if (!passwordRegex.test(password))
      return "Password must be at least 4 digits (numbers only)!";

    if (password !== repassword) return "Passwords do not match!";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Exclude repassword before sending
      const { repassword, ...payload } = formData;

      // Ensure all required fields exist
      const body = {
        email: payload.email,
        username: payload.username,
        phone: payload.phone,
        password: payload.password,
        bio: payload.bio || "",
      };

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      console.log("Response from backend:", result);

     if (res.ok) {
  localStorage.setItem("user", JSON.stringify(result.user));
  alert("Signup successful!");
  setFormData({
    email: "",
    username: "",
    phone: "",
    password: "",
    repassword: "",
    bio: "",
  });
  navigate("/");
}
 else {
        setError(result.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to connect to server");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "118vh" }}
    >
      <div className="auth-card" style={{ width: "100%", maxWidth: "420px" }}>
        <h2 className="text-center mb-4">Create Account</h2>

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
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
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

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="repassword"
              className="form-control"
              value={formData.repassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Bio</label>
            <textarea
              name="bio"
              className="form-control"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--bs-primary)" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
