import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

useEffect(() => {
  const checkAuth = async () => {
    try {
      await api.get("/user/me");
      setAuth(true);
    } catch {
      setAuth(false);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  if (auth) return <Navigate to="/dashboard" replace />;

  return children;
}
