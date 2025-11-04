// src/CustomerWebsite/pages/Footer.jsx
import { useState } from "react";
import {
  ShoppingCart,
  Home,
  Menu,
  Receipt,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Footer({
  cartItems = [],
  cartCount = 0,
  total = 0,
  onUpdateQuantity,
  onAddQuantity,
  onUpdateNote,
}) {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [notes, setNotes] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // -----------------------------------------------------------------
  // Helper: Check if current path matches target
  // -----------------------------------------------------------------
  const isActive = (targetPath) => {
    // Home → exact match
    if (targetPath === "/customerwebsite") {
      return location.pathname === "/customerwebsite";
    }
    // Menu → exact match
    if (targetPath === "/customerwebsite/menu") {
      return location.pathname === "/customerwebsite/menu";
    }
    // Orders → match base + any sub-path (like ?tab=items)
    if (targetPath === "/customerwebsite/orderhistory") {
      return location.pathname.startsWith("/customerwebsite/orderhistory");
    }
    return false;
  };

  // -----------------------------------------------------------------
  // 1. Note handling
  // -----------------------------------------------------------------
  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
    onUpdateNote?.(id, value);
  };

  // -----------------------------------------------------------------
  // 2. Validation helpers
  // -----------------------------------------------------------------
  const validateCustomer = () => {
    const err = {};
    if (!name.trim()) err.name = "Name is required";
    if (!phone.trim()) err.phone = "Phone is required";
    else if (!/^\d{10}$/.test(phone)) err.phone = "Enter a valid 10-digit number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateOtp = () => {
    const err = {};
    if (!otp.trim()) err.otp = "OTP is required";
    else if (!/^\d{4}$/.test(otp)) err.otp = "Enter a 4-digit OTP";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // -----------------------------------------------------------------
  // 3. Place order flow
  // -----------------------------------------------------------------
  const handlePlaceOrder = () => {
    if (cartCount === 0) return;
    setIsCartModalOpen(false);
    setIsOtpModalOpen(true);
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!validateCustomer()) return;
    console.log("Sending OTP to", phone);
    setErrors({});
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!validateOtp()) return;

    const ok = otp === "1234"; // demo

    if (!ok) {
      setErrors({ otp: "Invalid OTP" });
      return;
    }

    const orderPayload = {
      customer: { name, phone },
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        note: notes[i.id] || i.note || "",
      })),
      total,
    };
    console.log("Order payload:", orderPayload);

    setIsOtpModalOpen(false);
    setName("");
    setPhone("");
    setOtp("");
    setNotes({});
    navigate("/thank-you");
  };

  // -----------------------------------------------------------------
  // 4. Render
  // -----------------------------------------------------------------
  return (
    <>
      {/* ===================== MAIN FOOTER ===================== */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="px-4 py-2">
          {/* Cart Summary */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-700">
                {cartCount} {cartCount === 1 ? "item" : "items"} • ₹{total}
              </span>
            </div>
            <button
              onClick={() => setIsCartModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-sm shadow-md active:scale-95 transition"
            >
              View Cart
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-around text-xs">
            {/* Home */}
            <button
              onClick={() => navigate("/customerwebsite")}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive("/customerwebsite") ? "text-orange-600" : "text-gray-500"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            {/* Menu */}
            <button
              onClick={() => navigate("/customerwebsite/menu")}  // ← Fixed: Absolute path
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive("/customerwebsite/menu") ? "text-orange-600" : "text-gray-500"
              }`}
            >
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </button>

            {/* Orders */}
            <button
              onClick={() => navigate("/customerwebsite/orderhistory")}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive("/customerwebsite/orderhistory") ? "text-orange-600" : "text-gray-500"
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span>Orders</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ===================== CART MODAL ===================== */}
      {isCartModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex flex-col justify-end"
          onClick={() => setIsCartModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl flex flex-col max-h-[85vh] animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Your Cart ({cartCount})
                </h2>
                <button
                  onClick={() => setIsCartModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 py-12">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-4 pb-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-xl border">
                      <div className="flex justify-between items-center mb-2">
                        {/* VEG/NON-VEG + NAME */}
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              item.type === "veg" ? "border-green-600" : "border-red-600"
                            }`}
                          >
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                item.type === "veg" ? "bg-green-600" : "bg-red-600"
                              }`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-sm text-orange-600 mt-1">₹{item.price}</p>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1 border shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.id)}
                            className="text-red-500 hover:bg-red-50 rounded-full p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onAddQuantity(item)}
                            className="text-green-500 hover:bg-green-50 rounded-full p-1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Note */}
                      <input
                        type="text"
                        placeholder="Add note (e.g. less spicy)"
                        value={notes[item.id] || item.note || ""}
                        onChange={(e) => handleNoteChange(item.id, e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Place Order */}
            <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold text-gray-800">₹{total}</p>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={cartCount === 0}
                  className={`px-8 py-3 rounded-full font-bold text-white transition-all active:scale-95 ${
                    cartCount === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 shadow-lg"
                  }`}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== OTP MODAL ===================== */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Order</h2>
              <button
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setErrors({});
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            {!otp && (
              <form onSubmit={handleCustomerSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone (10 digits)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength={10}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition"
                  >
                    Send OTP
                  </button>
                </div>
              </form>
            )}

            {/* OTP */}
            {otp !== undefined && (
              <form onSubmit={handleOtpSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Enter OTP (sent to {phone})
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                        errors.otp ? "border-red-500" : ""
                      }`}
                      placeholder="1234"
                    />
                    {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition"
                  >
                    Verify & Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================== ANIMATION ===================== */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.35s ease-out forwards;
        }
      `}</style>
    </>
  );
}