// api.js
import axios from "axios";
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    baseURL: "http://127.0.0.1:8000/api", // 👉 change to your actual API URL
  headers: { "Content-Type": "application/json" },
    withCredentials: true, // <-- VERY IMPORTANT
});
export default api;
