// Footer.jsx
import { useState } from "react";
import { ShoppingCart, Home, Menu, Receipt } from "lucide-react";
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
  const {
    cartItems,
    cartCount,
    updateNote,
    clearCart,
  } = useCart();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [notes, setNotes] = useState({});
  const [orderNote, setOrderNote] = useState("");

  const isActive = (targetPath) => location.pathname === targetPath;

  const getToken = () => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      try {
        localStorage.setItem("cw_token", urlToken);
      } catch (e) {}
      return urlToken;
    }
    return localStorage.getItem("cw_token") || null;
  };

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
    updateNote?.(id, value);
  };

  const handlePlaceOrder = () => {
    if (cartCount === 0) return;
    setIsUserModalOpen(true);
  };

  // ⛔ SEND OTP
  const handleSendOtp = async () => {
    if (!name || !phone) {
      setErrors({ phone: "Name & Phone is required" });
      return;
    }

    if (!restaurantId) {
      setErrors({ phone: "Restaurant missing. Re-scan QR." });
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

      // Start Timer
      setOtpSent(true);
      setErrors({});
      setOtpTimer(30);
      setCanResend(false);

      let timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("OTP SEND ERROR:", err);
      setErrors({ phone: err?.response?.data?.message || "OTP send failed" });
    }
  };

  // 🔥 VERIFY OTP + PLACE ORDER
  const handleVerifyOtp = async (skipOtp = false) => {
    console.log("🔴 handleVerifyOtp CALLED, OTP=", otp);

    try {
      // OTP CHECK
      if (!skipOtp && otp.length !== 4) {
        setErrors({ otp: "Enter valid 4-digit OTP" });
        return;
      }

      // 🔥 VERIFY OTP FIRST
      console.log("🔥 ABOUT TO CALL VERIFY OTP");

      if (!skipOtp) {
        await api.post("/public/verify-otp", {
          phone,
          otp,
          restaurant_id: Number(restaurantId),
        });
        console.log("🔥 OTP VERIFIED SUCCESS");
      }

      // VALIDATE TABLE + CART
      if (!restaurantId || !tableId) {
        setErrors({ form: "Table/Restaurant missing. Re-scan QR." });
        return;
      }

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setErrors({ form: "Cart empty" });
        return;
      }

      // ORDER PAYLOAD
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

      console.log("ORDER PAYLOAD:", payload);

      // PLACE ORDER
      await api.post("/public/order", payload);
      toast.success("Order Placed Successfully ")
      // CLEANUP
      clearCart();
      setName("");
      setPhone("");
      setOtp("");
      setOtpSent(false);
      setErrors({});
      setIsUserModalOpen(false);
      setOrderNote("");
      setNotes({});

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
      console.error("VERIFY/ORDER ERROR:", err);
      setErrors({
        otp: err?.response?.data?.message || "OTP verification failed",
      });
    }
  };

  return (
    <>
      {/* FOOTER NAV */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around text-xs py-2">
          <button
            onClick={() => {
              const t = getToken();
              navigate(`/customerwebsite${t ? `?token=${t}` : ""}`);
            }}
            className={`flex flex-col items-center ${
              isActive("/customerwebsite")
                ? "text-orange-600"
                : "text-gray-500"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              const t = getToken();
              navigate(`/customerwebsite/menu${t ? `?token=${t}` : ""}`);
            }}
            className={`flex flex-col items-center ${
              isActive("/customerwebsite/menu")
                ? "text-orange-600"
                : "text-gray-500"
            }`}
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

          <button
            onClick={() => {
              const t = getToken();
              navigate(`/customerwebsite/orderhistory${t ? `?token=${t}` : ""}`);
            }}
            className={`flex flex-col items-center ${
              isActive("/customerwebsite/orderhistory")
                ? "text-orange-600"
                : "text-gray-500"
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span>Orders</span>
          </button>
        </div>
      </footer>

      {/* ORDER BUTTON */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 px-5 flex justify-center z-50">
          <div className="flex items-center justify-between w-full max-w-sm px-5 py-3 rounded-full shadow-xl bg-white">
            <div className="flex items-center gap-2 text-sm text-orange-900">
              <ShoppingCart className="w-4 h-4" />
              <span>{cartCount} items</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* OTP MODAL */}
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
