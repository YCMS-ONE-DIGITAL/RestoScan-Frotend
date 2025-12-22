// Footer.jsx
import { useState } from "react";
import { ShoppingCart, Home, Menu, Receipt, X, Circle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CardContext";
import api from "@/api/api";
import { encryptData } from "@/utils/encryption";
import UserDetailsModal from "../Components/UserDetailsModal";
import toast from "react-hot-toast";

export default function Footer({
  restaurantId,
  tableNo,
  tableId,
  restaurantName,
}) {
  const { cartItems, cartCount, updateNote, clearCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 MODALS
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // 🔥 USER / OTP
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔥 NOTES
  const [notes, setNotes] = useState({});
  const [orderNote, setOrderNote] = useState("");

  const isActive = (path) => location.pathname === path;

  const getToken = () => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      localStorage.setItem("cw_token", urlToken);
      return urlToken;
    }
    return localStorage.getItem("cw_token");
  };


  const cartTotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);


  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
    updateNote?.(id, value);
  };

  // 🔥 PLACE ORDER → CART MODAL
  const handlePlaceOrder = () => {
    if (cartCount === 0) return;
    setIsCartModalOpen(true);
  };

  // ⛔ SEND OTP
  const handleSendOtp = async () => {
    if (!name || !phone) {
      setErrors({ phone: "Name & Phone required" });
      return;
    }

    try {
      const res = await api.post("/public/send-otp", {
        phone,
        restaurant_id: Number(restaurantId),
      });

      if (res.data?.already_verified) {
        return handleVerifyOtp(true);
      }

      setOtpSent(true);
      setErrors({});
      setOtpTimer(30);
      setCanResend(false);

      const timer = setInterval(() => {
        setOtpTimer((p) => {
          if (p <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    } catch (err) {
      setErrors({
        phone: err?.response?.data?.message || "OTP send failed",
      });
    }
  };

  // 🔥 VERIFY OTP + PLACE ORDER
  const handleVerifyOtp = async (skipOtp = false) => {
    try {
      if (!skipOtp && otp.length !== 4) {
        setErrors({ otp: "Enter valid OTP" });
        return;
      }

      if (!skipOtp) {
        await api.post("/public/verify-otp", {
          phone,
          otp,
          restaurant_id: Number(restaurantId),
        });
      }

      const payload = {
        restaurant_id: Number(restaurantId),
        table_id: Number(tableId),
        name,
        phone,
        order_note: orderNote,
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          item_note: notes[item.id] || "",
        })),
      };

      await api.post("/public/order", payload);

      toast.success("Order Placed Successfully 🎉");

      clearCart();
      setIsUserModalOpen(false);
      setOtpSent(false);
      setNotes({});
      setOrderNote("");

      const newToken = btoa(
        encryptData({
          restaurant_id: Number(restaurantId),
          phone,
          restaurant_name: restaurantName,
          table_id: tableId,
          table_no: tableNo,
        })
      );

      localStorage.setItem("cw_token", newToken);
      navigate(`/customerwebsite/orderhistory?token=${newToken}`);
    } catch (err) {
      setErrors({
        otp: err?.response?.data?.message || "OTP verification failed",
      });
    }
  };

  return (
    <>
      {/* FOOTER NAV */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex justify-around text-xs py-2">
          <button
            onClick={() =>
              navigate(`/customerwebsite${getToken() ? `?token=${getToken()}` : ""}`)
            }
            className={isActive("/customerwebsite") ? "text-orange-600" : "text-gray-500"}
          >
            <Home className="w-5 h-5 mx-auto" />
            Home
          </button>

          <button
            onClick={() =>
              navigate(`/customerwebsite/menu${getToken() ? `?token=${getToken()}` : ""}`)
            }
            className={isActive("/customerwebsite/menu") ? "text-orange-600" : "text-gray-500"}
          >
            <Menu className="w-5 h-5 mx-auto" />
            Menu
          </button>

          <button
            onClick={() =>
              navigate(`/customerwebsite/orderhistory${getToken() ? `?token=${getToken()}` : ""}`)
            }
            className={isActive("/customerwebsite/orderhistory") ? "text-orange-600" : "text-gray-500"}
          >
            <Receipt className="w-5 h-5 mx-auto" />
            Orders
          </button>
        </div>
      </footer>

      {/* FLOATING CART BAR */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 px-5 z-50">
          <div className="bg-white rounded-full shadow-xl flex justify-between items-center px-5 py-3 max-w-sm mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart className="w-4 h-4" />
              {cartCount} items
            </div>
            <button
              onClick={handlePlaceOrder}
              className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* 🛒 CART MODAL */}
      {/* 🛒 CART MODAL – PREMIUM BOTTOM SHEET */}
{isCartModalOpen && (
  <div className="fixed inset-0 z-[60] bg-black/50 flex items-end">
    {/* BACKDROP CLICK */}
    <div
      className="absolute inset-0"
      onClick={() => setIsCartModalOpen(false)}
    />

    {/* SHEET */}
    <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slideUp">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="text-lg font-bold">Your Cart ({cartCount})</h2>
        <button
          onClick={() => setIsCartModalOpen(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ITEMS */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="border rounded-xl p-3">
           <div className="flex justify-between items-start gap-3">
  <div className="flex items-start gap-2">
    
    {/* 🟢 / 🔴 VEG-NONVEG DOT */}
    <Circle
      className={`w-3 h-3 mt-1 ${
        item.type === "nonveg" || item.is_veg === false
          ? "text-red-600 fill-red-600"
          : "text-green-600 fill-green-600"
      }`}
    />

    <div>
      <p className="font-semibold text-sm">{item.name}</p>
      <p className="text-xs text-gray-500">
        Qty: {item.quantity}
      </p>
    </div>
  </div>

  <p className="font-bold text-sm whitespace-nowrap">
    ₹{item.price * item.quantity}
  </p>
</div>


            <input
              type="text"
              placeholder="Add item note (optional)"
              className="mt-2 w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={notes[item.id] || ""}
              onChange={(e) => handleNoteChange(item.id, e.target.value)}
            />
          </div>
        ))}

        {/* ORDER NOTE */}
        <textarea
          placeholder="Order note (optional)"
          className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          rows={2}
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />
      </div>

      {/* FOOTER ACTION */}
      <div className="border-t px-5 py-4 bg-white sticky bottom-0">
      <button
  onClick={() => {
    setIsCartModalOpen(false);
    setIsUserModalOpen(true);
  }}
  className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition flex justify-between items-center px-5"
>
  <div className="flex flex-col text-left">
    <span>Continue</span>
    <span className="text-xs opacity-90">Including all items</span>
  </div>
  <span className="text-lg">₹{cartTotal}</span>
</button>

      </div>
    </div>
  </div>
)}


      {/* 🔐 OTP MODAL */}
      <UserDetailsModal
        isOpen={isUserModalOpen}
        name={name}
        phone={phone}
        otp={otp}
        setName={setName}
        setPhone={setPhone}
        setOtp={setOtp}
        otpSent={otpSent}
        otpTimer={otpTimer}
        canResend={canResend}
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
