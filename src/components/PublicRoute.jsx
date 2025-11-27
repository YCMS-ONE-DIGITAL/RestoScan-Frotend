import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    api.get("/user/me")
      .then(() => {
        setAuth(true);     // ✔ user logged in
      })
      .catch(() => {
        setAuth(false);    // ❌ not logged in
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  // ⭐ logged-in user should NOT see login/signup
  if (auth) return <Navigate to="/dashboard" replace />;

  return children;
}
