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

  // const getImageUrl = (path) => {
  //   if (!path) return null;
  //   if (path.startsWith("http")) return path;
  //   const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
  //   return `${base}/storage/${path}`;
  // };

  const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const base =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8000";

  return `${base}/${path}`;
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
    if (onNavigate) onNavigate(); // Mobile drawer close karne ke liye
  };

  const links = [
    { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "/dashboard/menus",
      label: "Menu",
      icon: Utensils,
      children: [
                        { id: "/dashboard/menus/categories", label: "Categories" },

        { id: "/dashboard/menus", label: "Menus" },

        { id: "/dashboard/menus/items", label: "Menu Items" },
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
    <aside className="h-full bg-[#121826] p-4 flex flex-col text-white">
      {/* Logo & Name */}
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/10">
        {logo ? (
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 rounded-lg object-cover border border-white/20"
          />
        ) : (
          <div className="bg-indigo-600 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-white">
            {restaurantName.charAt(0)}
          </div>
        )}
        <span className="font-semibold truncate text-white">
          {restaurantName}
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            link.id === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.id || pathname.startsWith(link.id + "/");

          const isChildActive = link.children?.some(
            (child) => pathname === child.id
          );

          return (
            <div key={link.id}>
              {/* Main Link */}
              <button
                onClick={() => handleNav(link.id)}
                className={cn(
                  "flex items-center w-full px-4 py-3 rounded-lg transition-all text-left font-medium",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <link.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </button>

              {/* Submenu - Only show if parent is active */}
              {link.children && (isActive || isChildActive) && (
                <div className="ml-8 mt-2 space-y-1 border-l border-white/10 pl-4">
                  {link.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNav(child.id);
                      }}
                      className={cn(
                        "block w-full text-left py-2 px-3 rounded transition text-sm",
                        pathname === child.id
                          ? "text-indigo-400 font-semibold bg-indigo-600/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
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