// src/components/layout/Sidebar.jsx

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Utensils,
  Table2,
  UserStarIcon,
  Users,
  CreditCardIcon,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/api/api";

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [logo, setLogo] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return `${base}/storage/${path}`;
  };

  useEffect(() => {
    let mounted = true;

    const fetchRestaurant = async () => {
      try {
        const res = await api.get("/restaurant/show");
        if (mounted && res.data?.restaurant) {
          setRestaurantName(res.data.restaurant.restaurant_name || "Restaurant");
          setLogo(getImageUrl(res.data.restaurant.logo_url));
        }
      } catch (e) {
        console.error("Restaurant fetch error:", e);
      }
    };

    fetchRestaurant();
    return () => (mounted = false);
  }, []);

  const handleNav = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const links = [
    { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

    {
      id: "/dashboard/menus",
      label: "Menu",
      icon: Utensils,
      children: [
        { id: "/dashboard/menus", label: "Menus" },
        { id: "/dashboard/menus/items", label: "Menu Items" },
        { id: "/dashboard/menus/categories", label: "Categories" },
      ],
    },

    {
      id: "/dashboard/orders",
      label: "Orders",
      icon: Utensils,
      children: [
        { id: "/dashboard/orders", label: "Orders" },
        { id: "/dashboard/orders/kot", label: "KOT" },
      ],
    },

    { id: "/dashboard/tables", label: "Tables", icon: Table2 },
    { id: "/dashboard/pos", label: "POS", icon: Table2 },
    { id: "/dashboard/customers", label: "Customers", icon: Users },
    { id: "/dashboard/staff", label: "Staff", icon: UserStarIcon },
    { id: "/dashboard/payments", label: "Payments", icon: CreditCardIcon },
    { id: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="h-full bg-[#121826] p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/10">
        {logo ? (
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-lg object-cover border border-white/20"
          />
        ) : (
          <div className="bg-indigo-600 w-10 h-10 flex items-center justify-center rounded-lg font-bold">
            {restaurantName.charAt(0)}
          </div>
        )}

        <span className="font-semibold truncate">{restaurantName}</span>
      </div>

      {/* Nav */}
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive =
            link.id === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.id || pathname.startsWith(link.id + "/");

          return (
            <div key={link.id}>
              <button
                onClick={() => handleNav(link.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 rounded-lg transition-all text-left",
                  isActive
                    ? "bg-indigo-600 shadow-md"
                    : "hover:bg-indigo-500/20"
                )}
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.label}
              </button>

              {link.children && isActive && (
                <div className="ml-5 mt-2 space-y-1 border-l border-white/10 pl-3">
                  {link.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleNav(child.id)}
                      className={cn(
                        "block w-full text-left text-sm px-2 py-1 rounded transition",
                        pathname === child.id
                          ? "text-indigo-400 font-semibold"
                          : "text-gray-400 hover:text-white"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
