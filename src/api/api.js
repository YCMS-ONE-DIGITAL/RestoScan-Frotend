import axios from "axios"; // ⭐ ONLY ONE import
const BASE_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
    baseURL: `${BASE_URL}/api`,

  // baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);



export default api;
