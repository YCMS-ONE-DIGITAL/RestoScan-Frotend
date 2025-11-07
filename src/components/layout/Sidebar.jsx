// src/components/layout/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Utensils, Table2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
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

  
  { id: "/reservations", label: "Reservations", icon: CalendarDays },
];

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNav = (id) => {
    navigate(id);
    if (onNavigate) onNavigate(); // Close drawer on mobile
  };

  return (
    <aside className="w-64 bg-[#121826] text-white h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-indigo-500 text-white w-8 h-8 flex items-center justify-center rounded-md font-bold">
          T
        </div>
        <span className="text-lg font-semibold">kokan katta</span>
      </div>

      <nav className="space-y-2">
        {navLinks.map((link) => (
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
