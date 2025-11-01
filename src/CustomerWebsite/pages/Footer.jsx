// Footer.jsx
import { ShoppingCart, Home, Menu, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer({ cartCount = 0, total = 0 }) {
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="px-4 py-2">
        {/* CART SUMMARY */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-700">
              {cartCount} {cartCount === 1 ? "item" : "items"} ₹{total}
            </span>
          </div>
          <button
            onClick={() => navigate("/cart")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-sm shadow-md active:scale-95 transition"
          >
            View Cart
          </button>
        </div>

        {/* BOTTOM NAV */}
        <div className="flex justify-around text-xs text-gray-600">
          <button className="flex flex-col items-center gap-1 text-orange-600">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Receipt className="w-5 h-5" />
            <span>Orders</span>
          </button>
        </div>
      </div>
    </footer>
  );
}