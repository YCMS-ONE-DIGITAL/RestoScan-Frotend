// src/components/layout/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Utensils,
  Table2,
  UserStarIcon,
  Users,
  CreditCardIcon,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/api/api";

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [logo, setLogo] = useState(null);

  // IMAGE FIX HELPER
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return `${base}/storage/${path}`;
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get("/restaurant/show");

        if (res.data?.restaurant) {
          const r = res.data.restaurant;

          setRestaurantName(r.restaurant_name || "Restaurant");
          setLogo(getImageUrl(r.logo_url));   // ⭐ Set Logo
        }
      } catch (err) {
        console.error("Restaurant fetch error:", err);
      }
    };

    fetchRestaurant();
  }, []);

  const handleNav = (id) => {
    navigate(id);
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="w-full bg-[#121826] text-white h-screen overflow-y-auto p-4 flex flex-col">

      {/* ⭐ Restaurant Logo + Name */}
      <div className="flex items-center gap-3 mb-8">

        {/* Logo OR Fallback Initial */}
        {logo ? (
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-lg object-cover border border-white/20"
          />
        ) : (
          <div className="bg-indigo-500 text-white w-10 h-10 flex items-center justify-center rounded-md font-bold uppercase">
            {restaurantName.charAt(0)}
          </div>
        )}

        <span className="text-lg font-semibold capitalize truncate max-w-[160px]">
          {restaurantName}
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {[
          { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

          {
            id: "/menus",
            label: "Menu",
            icon: Utensils,
            children: [
              { id: "/menus", label: "Menus" },
              { id: "/menus/items", label: "Menu Items" },
              { id: "/menus/categories", label: "Item Categories" },
            ],
          },

          {
            id: "/orders",
            label: "Orders",
            icon: Utensils,
            children: [
              { id: "/orders", label: "Orders" },
              { id: "/orders/kot", label: "KOT" },
            ],
          },

          { id: "/tables", label: "Tables", icon: Table2 },
          { id: "/pos", label: "POS", icon: Table2 },
          { id: "/customers", label: "Customers", icon: Users },
          { id: "/staff", label: "Staff", icon: UserStarIcon },

          { id: "/payments", label: "Payments", icon: CreditCardIcon },

          { id: "/settings", label: "Setting", icon: Settings },
        ].map((link) => (
          <div key={link.id}>
            <button
              onClick={() => handleNav(link.id)}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-md hover:bg-indigo-600 transition-colors text-left",
                pathname.startsWith(link.id) && "bg-indigo-600"
              )}
            >
              <link.icon className="w-5 h-5 mr-2" />
              {link.label}
            </button>

            {link.children && pathname.startsWith(link.id) && (
              <div className="ml-6 mt-2 space-y-1">
                {link.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleNav(child.id)}
                    className={cn(
                      "block text-sm text-gray-300 hover:text-white",
                      pathname === child.id && "text-indigo-400"
                    )}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
