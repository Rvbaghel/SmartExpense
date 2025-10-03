export const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL // Render backend URL
    : "http://localhost:5000";                // Local backend
