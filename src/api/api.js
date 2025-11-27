import axios from "axios"; // ⭐ ONLY ONE import

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.config?.url?.includes("/user/me") &&
      err.response?.status === 401
    ) {
      return Promise.reject(false);
    }

    return Promise.reject(err);
  }
);

export default api;
