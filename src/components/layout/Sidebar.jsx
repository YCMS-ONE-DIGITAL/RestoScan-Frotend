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
  Settings,
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
          setLogo(getImageUrl(r.logo_url));
        }
      } catch (err) {
        console.error("Restaurant fetch error:", err);
      }
    };

    fetchRestaurant();
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
        { id: "/dashboard/menus/categories", label: "Item Categories" },
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
    { id: "/dashboard/settings", label: "Setting", icon: Settings },
  ];

  return (
    <aside className="w-full bg-[#121826] text-white overflow-y-auto p-4 flex flex-col">
      {/* ⭐ Restaurant Logo + Name */}
      <div className="flex items-center gap-3 mb-8">
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
        {links.map((link) => {
          // 🔑 ACTIVE LOGIC (Dashboard special case)
          const isActive =
            link.id === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.id || pathname.startsWith(link.id + "/");

          return (
            <div key={link.id}>
              <button
                onClick={() => handleNav(link.id)}
                className={cn(
                  "flex items-center w-full px-3 py-2 rounded-md transition-colors text-left",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-600"
                )}
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.label}
              </button>

              {/* Sub Menu */}
              {link.children && isActive && (
                <div className="ml-6 mt-2 space-y-1">
                  {link.children.map((child) => {
                    const isChildActive = pathname === child.id;

                    return (
                      <button
                        key={child.id}
                        onClick={() => handleNav(child.id)}
                        className={cn(
                          "block w-full text-left text-sm px-2 py-1 rounded",
                          isChildActive
                            ? "text-indigo-400 font-semibold"
                            : "text-gray-300 hover:text-white"
                        )}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
