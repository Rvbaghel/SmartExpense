import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Loader from "../components/Loader";
import { API_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log("Login response:", result);

      if (res.ok) {
        login(result.user);
        navigate("/");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 transition-colors 
      ${loading ? "overflow-hidden" : ""}
      ${"bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"}`}
    >
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-lg transition 
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-800`}
        >
          <h2 className="text-3xl font-bold text-center mb-4 text-sky-600 dark:text-teal-400">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
            Login to your account
          </p>

          {error && (
            <div className="mb-4 text-center text-red-500 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900
                border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100
                focus:ring-2 focus:ring-sky-500 dark:focus:ring-teal-500 outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900
                border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100
                focus:ring-2 focus:ring-sky-500 dark:focus:ring-teal-500 outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 mt-2 rounded-xl text-white font-semibold
              bg-gradient-to-r from-sky-600 to-blue-700 
              hover:from-sky-500 hover:to-blue-600
              dark:from-teal-600 dark:to-emerald-700
              hover:shadow-md active:scale-95 transition-transform duration-200"
            >
              Login
            </button>
          </form>

          {/* Sign Up Redirect */}
          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-sky-600 dark:text-teal-400 hover:underline font-medium no-underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
