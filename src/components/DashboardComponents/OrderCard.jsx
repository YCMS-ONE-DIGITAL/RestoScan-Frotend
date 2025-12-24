import React from "react";
import { Clock, IndianRupee, Package } from "lucide-react";

export default function OrderCard({
  table,
  orderNo,
  customer,
  status,
  paymentStatus,
  time,
  orderType,
  items,
  total,
  onClick,
}) {
  /* ---------------- STATUS FORMAT ---------------- */
  const formatStatus = () => {
    switch (status) {
      case "kot":
        return "KOT";
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

  const statusConfig = {
    Pending: {
      bg: "bg-gray-500/15",
      text: "text-gray-300",
      border: "border-gray-500/30",
      dot: "bg-gray-300",
      ring: "ring-gray-500/20",
    },
    KOT: {
      bg: "bg-purple-500/15",
      text: "text-purple-400",
      border: "border-purple-500/30",
      dot: "bg-purple-400",
      ring: "ring-purple-500/20",
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

  const paymentConfig = {
    paid: "text-green-400",
    pending: "text-red-400",
  };

  return (
    <div
      onClick={onClick}
      className="
        group relative
        bg-gray-800 border border-gray-700 rounded-xl
        p-4 sm:p-5
        cursor-pointer
        transition-all duration-300
        hover:shadow-xl hover:border-gray-600
        active:scale-[0.98]
      "
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 ring-4 ring-transparent group-hover:ring-inset ${config.ring} transition-all`}
      />

      {/* ---------------- TOP SECTION ---------------- */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
        {/* LEFT */}
        <div className="flex gap-3 min-w-0">
          {/* TABLE */}
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shrink-0">
            <span className="text-white font-bold text-base sm:text-lg">
              {table}
            </span>
          </div>

          {/* ORDER INFO */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-base sm:text-lg truncate">
              Order #{orderNo}
            </h3>

            {/* ORDER TYPE */}
            <span
              className={`
                inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded
                ${
                  orderType === "dinein"
                    ? "bg-blue-600"
                    : orderType === "parcel"
                    ? "bg-green-600"
                    : "bg-purple-600"
                }
              `}
            >
              {orderType?.toUpperCase()}
            </span>

            <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> {time}
            </p>

            {customer && (
              <p className="text-gray-400 text-xs mt-1 truncate">
                {customer.name} • {customer.phone}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT STATUS */}
        <div className="flex sm:flex-col sm:items-end gap-2">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase border ${config.bg} ${config.text} ${config.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
            {uiStatus}
          </span>

          {paymentStatus && (
            <span
              className={`text-[10px] font-semibold ${paymentConfig[paymentStatus]}`}
            >
              {paymentStatus.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* ---------------- ITEMS ---------------- */}
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <Package className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium">{items} items</span>
      </div>

      {/* ---------------- TOTAL ---------------- */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 border-t border-gray-700">
        <span className="text-gray-400 text-sm font-medium">
          Total Amount
        </span>

        <div className="flex items-center">
          <IndianRupee className="w-5 h-5 text-green-400" />
          <span className="text-xl sm:text-2xl font-bold text-white ml-1">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
