import React from "react";
import { Clock, IndianRupee, Package } from "lucide-react";

export default function OrderCard({
  table,
  orderNo,
  customer,
  status, // backend order status
  paymentStatus, // backend payment status
  time,
  orderType,
  items,
  total,
  onClick,
}) {
  // ✅ Convert DB status into UI readable text
  const formatStatus = () => {
    switch (status) {
      case "preparing":
        return "Preparing";
      case "served":
        return "Served";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const uiStatus = formatStatus();

  // ✅ Order status UI color mapping
  const statusConfig = {
    Pending: {
      bg: "bg-gray-500/15",
      text: "text-gray-300",
      border: "border-gray-500/30",
      dot: "bg-gray-300",
      ring: "ring-gray-500/20",
    },
    Preparing: {
      bg: "bg-yellow-500/15",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      dot: "bg-yellow-400",
      ring: "ring-yellow-500/20",
    },
    Served: {
      bg: "bg-blue-500/15",
      text: "text-blue-400",
      border: "border-blue-500/30",
      dot: "bg-blue-400",
      ring: "ring-blue-500/20",
    },
    Completed: {
      bg: "bg-green-500/15",
      text: "text-green-400",
      border: "border-green-500/30",
      dot: "bg-green-400",
      ring: "ring-green-500/20",
    },
    Cancelled: {
      bg: "bg-red-500/15",
      text: "text-red-400",
      border: "border-red-500/30",
      dot: "bg-red-400",
      ring: "ring-red-500/20",
    },
  };

  const config = statusConfig[uiStatus] || statusConfig.Pending;

  // ✅ Payment badge mapping
  const paymentConfig = {
    paid: "text-green-400",
    pending: "text-red-400",
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-gray-800 border border-gray-700 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-gray-600 hover:bg-gray-750"
    >
      {/* Glow Hover Effect */}
      <div
        className={`absolute inset-0 ring-4 ring-transparent group-hover:ring-inset ${config.ring} transition-all duration-500`}
      />

      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
            <span className="text-white font-bold text-lg">{table}</span>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg">Order #{orderNo}</h3>
              {/* ✅ Order type badge */}
  <span
    className={`px-2 py-1 text-xs rounded ${
      orderType === "dinein"
        ? "bg-blue-600"
        : orderType === "parcel"
        ? "bg-green-600"
        : "bg-purple-600"
    }`}
  >
    {orderType?.toUpperCase()}
  </span>
            <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5" /> {time}
            </p>

            {/* ✅ Customer Info */}
            {customer && (
              <p className="text-gray-400 text-xs mt-1">
                {customer.name} • {customer.phone}
              </p>
            )}
          </div>
        </div>

        {/* ✅ Order Status Badge */}
        <div className="flex flex-col items-end">
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
            {uiStatus}
          </span>

          {/* ✅ Payment Status Badge Below */}
          {paymentStatus && (
            <p className={`text-[10px] mt-1 font-semibold ${paymentConfig[paymentStatus]}`}>
              {paymentStatus.toUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* Item Count */}
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <Package className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium">{items}</span>
      </div>

      {/* Total Bill */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <span className="text-gray-400 text-sm font-medium">Total Amount</span>
        <div className="flex items-center">
          <IndianRupee className="w-5 h-5 text-green-400" />
          <span className="text-2xl font-bold text-white ml-1">{total}</span>
        </div>
      </div>
    </div>
  );
}
