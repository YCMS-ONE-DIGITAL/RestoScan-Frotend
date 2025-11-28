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
import { useCart } from "../context/CardContext";
import api from "@/api/api";
import { encryptData } from "@/utils/encryption";


import UserDetailsWithOtpModal from "../Components/UserDetailsModal"; // ✅ IMPORT MODAL

export default function Footer({ restaurantId,
  tableNo, tableId,RestaurantName }) {
  const {
    cartItems,
    cartCount,
    total,
    addToCart,
    removeFromCart,
    updateNote,
    clearCart,
  } = useCart();

  // console.log()

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // ✅ USER FORM / OTP STATES
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const [notes, setNotes] = useState({});
  const isActive = (targetPath) => location.pathname === targetPath;

  // ✅ Notes
  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
    updateNote?.(id, value);
  };

  // ✅ PLACE ORDER → Open User Details modal
  const handlePlaceOrder = () => {
    if (cartCount === 0) return;
    setIsCartModalOpen(false);
    setIsUserModalOpen(true);
  };

  // ✅ Send OTP
  const handleSendOtp = () => {
    if (!name || !phone) {
      setErrors({ phone: "Name & Phone Number Required" });
      return;
    }
    setErrors({});
    setOtpSent(true);
  };

  // ✅ Verify OTP
  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (otp !== "1234") {
      setErrors({ otp: "Invalid OTP" });
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      alert("Token missing!");
      return;
    }

    if (!restaurantId || !tableId) {
      alert("Something went wrong. Table/Restaurant missing.");
      return;
    }

    try {
      const payload = {
        restaurant_id: Number(restaurantId),
        table_id: Number(tableId),
        name,
        phone,
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      };

      await api.post("/public/order/create", payload);

      // ✅ CLEAR CART
      clearCart();

      // ✅ RESET USER FORM
      setName("");
      setPhone("");
      setOtp("");
      setOtpSent(false);
      setErrors({});
      setIsUserModalOpen(false);

      // ✅ Generate updated token with phone

      const newToken = btoa(
        encryptData({
          restaurant_id: Number(restaurantId),
          phone, // ✅ important for history
         restaurant_name: RestaurantName,
    // table_no: table.number,   // only for dine-in
    // table_id: table.id,
        })
      );

      navigate(`/customerwebsite/orderhistory?token=${newToken}`);


      // ✅ Redirect with updated token
      // navigate(`/customerwebsite/orderhistory?token=${newToken}`);
    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Order creation failed");
    }
  };




  return (
    <>
      {/* ============= FOOTER NAVBAR ============= */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around text-xs py-2">
          <button
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              const newToken = params.get("token");
              navigate(`/customerwebsite?token=${newToken}`);
            }}
            className={`flex flex-col items-center ${isActive("/customerwebsite") ? "text-orange-600" : "text-gray-500"
              }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              const newToken = params.get("token");
              navigate(`/customerwebsite/menu?token=${newToken}`);
            }}
            className={`flex flex-col items-center ${isActive("/customerwebsite/menu") ? "text-orange-600" : "text-gray-500"
              }`}
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

          <button
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              const newToken = params.get("token");
              navigate(`/customerwebsite/orderhistory?token=${newToken}`);
            }}
            className={`flex flex-col items-center ${isActive("/customerwebsite/orderhistory")
                ? "text-orange-600"
                : "text-gray-500"
              }`}
          >
            <Receipt className="w-5 h-5" />
            <span>Orders</span>
          </button>
        </div>
      </footer>

      {/* ============= CART FLOATING TOAST ============= */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 px-5 flex justify-center z-50">
          <div className="flex items-center justify-between w-full max-w-sm px-5 py-3 rounded-full shadow-xl bg-white">
            <div className="flex items-center gap-2 text-sm text-orange-900">
              <ShoppingCart className="w-4 h-4" />
              <span>
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
              >
                View Cart
              </button>
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-black p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= CART MODAL (UNCHANGED) ============= */}
      {isCartModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex flex-col justify-end"
          onClick={() => setIsCartModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl flex flex-col max-h-[85vh] animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between">
              <h2 className="font-semibold text-lg">Your Cart ({cartCount})</h2>
              <button onClick={() => setIsCartModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-xl border mb-3">
  <div className="flex justify-between items-start mb-2">
    
    {/* ✅ Veg / Non-Veg + Name + Price */}
    <div>
      <div className="flex items-center gap-2">
        {item.type === "veg" ? (
          <span className="w-3 h-3 rounded-sm border border-green-600 flex items-center justify-center">
            <span className="w-2 h-2 rounded-sm bg-green-600" />
          </span>
        ) : (
          <span className="w-3 h-3 rounded-sm border border-red-600 flex items-center justify-center">
            <span className="w-2 h-2 rounded-sm bg-red-600" />
          </span>
        )}
        <p className="font-medium text-gray-800">{item.name}</p>
      </div>

      {/* ✅ Price per item */}
      <p className="text-xs text-gray-600 mt-1">₹{item.price}</p>
    </div>

    {/* ✅ Quantity Controller */}
    <div className="flex items-center gap-1 bg-white border px-2 py-1 rounded-full">
      <button onClick={() => removeFromCart(item.id)}>
        <Minus className="w-4 h-4 text-red-500" />
      </button>
      <span className="text-sm font-bold">{item.quantity}</span>
      <button onClick={() => addToCart(item)}>
        <Plus className="w-4 h-4 text-green-500" />
      </button>
    </div>
  </div>

  {/* ✅ Line Total */}
  <div className="flex justify-between text-sm font-semibold text-gray-800 mb-2">
    <span>Total</span>
    <span>₹{item.price * item.quantity}</span>
  </div>

  {/* ✅ Notes */}
  <input
    type="text"
    placeholder="Add note..."
    value={notes[item.id] || ""}
    onChange={(e) => handleNoteChange(item.id, e.target.value)}
    className="w-full px-3 py-2 border rounded-lg text-sm"
  />
</div>

                ))
              )}
            </div>

            <div className="p-4 border-t flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-bold text-xl">₹{total}</p>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ USER DETAILS + OTP MODAL */}
      <UserDetailsWithOtpModal
        isOpen={isUserModalOpen}
        name={name}
        phone={phone}
        otp={otp}
        setName={setName}
        setPhone={setPhone}
        setOtp={setOtp}
        otpSent={otpSent}
        errors={errors}
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
        onClose={() => {
          setIsUserModalOpen(false);
          setOtpSent(false);
        }}
      />
    </>
  );
}
