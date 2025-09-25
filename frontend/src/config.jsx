export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://smartexpense-28.onrender.com" // Render backend URL
    : "http://localhost:5000";                // Local backend
