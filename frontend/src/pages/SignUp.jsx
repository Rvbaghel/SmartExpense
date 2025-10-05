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
      const { repassword, ...payload } = formData;
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
      } else {
        setError(result.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to connect to server");
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 transition-colors 
      bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-10`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-lg transition 
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800`}
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-sky-600 dark:text-teal-400">
          Create Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Join us to manage your finances smartly!
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

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900
              border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100
              focus:ring-2 focus:ring-sky-500 dark:focus:ring-teal-500 outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="10-digit number"
              value={formData.phone}
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
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900
              border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100
              focus:ring-2 focus:ring-sky-500 dark:focus:ring-teal-500 outline-none transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="repassword"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="repassword"
              id="repassword"
              placeholder="Re-enter password"
              value={formData.repassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900
              border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100
              focus:ring-2 focus:ring-sky-500 dark:focus:ring-teal-500 outline-none transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows="3"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-900
              border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100
              focus:ring-2 focus:ring-sky-500 dark:focus:ring-teal-500 outline-none transition resize-none"
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
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 dark:text-teal-400 hover:underline font-medium no-underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
