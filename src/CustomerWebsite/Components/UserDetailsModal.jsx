import React from "react";
import { X } from "lucide-react";

export default function UserDetailsModal({
  isOpen,
  name,
  phone,
  setName,
  setPhone,
  otp,
  setOtp,
  errors,
  onSendOtp,
  onVerifyOtp,
  onClose,
  otpSent,
  otpTimer,
  canResend,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center">
      <div
        className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {otpSent ? "Enter OTP" : "Enter Your Details"}
        </h2>

        {/* STEP 1 — Name + Phone */}
        {!otpSent && (
          <>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
            )}

            <button
              onClick={onSendOtp}
              className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold"
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 — OTP Boxes */}
        {otpSent && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              OTP sent to <strong>{phone}</strong>
            </p>

            {/* ⭐ OTP INPUT BOXES */}
            <div className="flex justify-between mb-3">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  id={`otp-box-${i}`}
                  maxLength={1}
                  value={otp[i] || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/, "");

                    const arr = (otp || "").split("");
                    arr[i] = value;
                    const final = arr.join("").slice(0, 4);

                    setOtp(final);

                    if (value && i < 3) {
                      document.getElementById(`otp-box-${i + 1}`).focus();
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
                    if (paste.length === 4) setOtp(paste);
                  }}
                  className="w-12 h-12 text-center border rounded-lg text-lg font-bold"
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-red-500 text-sm mb-2">{errors.otp}</p>
            )}

            {/* ⭐ RESEND TIMER */}
            {canResend ? (
              <button
                onClick={onSendOtp}
                className="text-blue-600 text-sm mb-3 font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-sm mb-3">
                Resend OTP in {otpTimer}s
              </p>
            )}

            {/* ⭐ VERIFY BUTTON */}
            <button
onClick={() => onVerifyOtp()}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold"
            >
              Verify & Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
