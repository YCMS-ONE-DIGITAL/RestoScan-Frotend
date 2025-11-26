import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api";

export default function ProtectedRoutes({
  requireRestaurant = false,
  blockIfRestaurantExists = false,
  children,
}) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [hasRestaurant, setHasRestaurant] = useState(false);

  useEffect(() => {
    api
      .get("/user/me")
      .then(() => {
        setAuth(true);
        return api.get("/restaurant/check");
      })
      .then((res) => setHasRestaurant(res.data.has_restaurant))
      .catch(() => setAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  // ❌ Not logged in → go login
  if (!auth) return <Navigate to="/login" replace />;

  // ❌ User already has restaurant but trying to access add-restaurant
  if (blockIfRestaurantExists && hasRestaurant)
    return <Navigate to="/dashboard" replace />;

  // ❌ User logged in but restaurant not created → block dashboard
  if (requireRestaurant && !hasRestaurant)
    return <Navigate to="/add-restaurant" replace />;

  return children;
}
