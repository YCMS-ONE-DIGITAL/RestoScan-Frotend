import React from "react";
import { X } from "lucide-react";

export default function UserDetailsWithOtpModal({
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
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center">
      <div
        className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {otpSent ? "Enter OTP" : "Enter Your Details"}
        </h2>

        {/* Step 1 → Name + Phone */}
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

        {/* Step 2 → OTP Box */}
        {otpSent && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              OTP sent to <strong>{phone}</strong>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              placeholder="Enter OTP"
            />
            {errors.otp && (
              <p className="text-red-500 text-sm">{errors.otp}</p>
            )}

            <button
              onClick={onVerifyOtp}
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
