import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, 
});

// ⭐ HIDE 401 for /user/me completely
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.config?.url?.includes("/user/me") && 
      err.response?.status === 401
    ) {
      // do not show any console error
      return Promise.reject(false);
    }

    return Promise.reject(err);
  }
);

export default api;
