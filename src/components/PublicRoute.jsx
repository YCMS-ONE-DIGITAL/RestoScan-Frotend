import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    // ✅ Check if cookie contains token before calling API
    const hasToken = document.cookie.includes("auth_token");

    if (!hasToken) {
      setAuth(false);
      setLoading(false);
      return;
    }

    // ✅ Token exists → verify silently
    api
      .head("/user/me", { validateStatus: () => true })
      .then((res) => setAuth(res.status === 200))
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  // ✅ logged-in users cannot visit login/signup
  if (auth) return <Navigate to="/dashboard" replace />;

  return children;
}
