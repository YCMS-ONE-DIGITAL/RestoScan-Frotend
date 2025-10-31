// Footer.jsx
import React from "react";
import { ShoppingCart, Home, Menu, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ← YAHAN IMPORT KARO!

export default function Footer({ cartCount = 0, total = 0, orderType = "DineIn" }) {
  const navigate = useNavigate(); // ← YAHAN USE KARO

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="px-4 py-3">
        {/* Cart Summary + Button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            <span>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
            <span className="font-bold text-orange-600">₹{total}</span>
          </div>

          <button
            onClick={() => navigate("/cart")} // ← YAHAN useNavigate use hua
            disabled={cartCount === 0}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all shadow-md
              ${cartCount === 0 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white active:scale-95"
              }`}
          >
            View Cart
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-around text-xs text-gray-600 border-t border-gray-100 pt-2">
          <button className="flex flex-col items-center gap-1 hover:text-orange-600 transition">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button 
            onClick={() => navigate("/menu")} 
            className="flex flex-col items-center gap-1 hover:text-orange-600 transition"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

          {/* ORDER */}
          <button 
            onClick={() => navigate("/orders")} 
            className="flex flex-col items-center gap-1 hover:text-orange-600 transition"
          >
            <Receipt className="w-5 h-5" />
            <span>Orders</span>
          </button>
        </div>
      </div>
    </footer>
  );
}