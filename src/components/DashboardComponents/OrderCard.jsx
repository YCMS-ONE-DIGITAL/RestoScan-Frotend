import React from "react";
import { Clock, IndianRupee, Package } from "lucide-react";

export default function OrderCard({
  table,
  orderNo,
  status, // "Paid" | "KOT" | "Pending"
  statusText,
  time,
  items,
  total,
  onClick,
}) {
  // Modern Status Badges (Zomato/Swiggy style)
  const statusConfig = {
    Paid: {
      bg: "bg-green-500/15",
      text: "text-green-400",
      border: "border-green-500/30",
      dot: "text-green-400",
      ring: "ring-green-500/20",
    },
    KOT: {
      bg: "bg-yellow-500/15",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      dot: "text-yellow-400",
      ring: "ring-yellow-500/20",
    },
    Pending: {
      bg: "bg-red-500/15",
      text: "text-red-400",
      border: "border-red-500/30",
      dot: "text-red-400",
      ring: "ring-red-500/20",
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-gray-800 border border-gray-700 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-gray-600 hover:bg-gray-750"
    >
      {/* Optional: Glow ring on hover */}
      <div className={`absolute inset-0 ring-4 ring-transparent group-hover:ring-inset ${config.ring} transition-all duration-500`} />

      {/* Header: Table + Order No + Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {/* Table Badge */}
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
            <span className="text-white font-bold text-lg">{table}</span>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg">Order #{orderNo}</h3>
            <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5" />
              {time}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-right">
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
            {status}
          </span>
          {statusText && (
            <p className="text-xs text-gray-400 mt-1.5">{statusText}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <Package className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium">{items}</span>
      </div>

      {/* Footer: Total */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <span className="text-gray-400 text-sm font-medium">Total Amount</span>
        <div className="flex items-center">
          <IndianRupee className="w-5 h-5 text-green-400" />
          <span className="text-2xl font-bold text-white ml-1">{total}</span>
        </div>
      </div>

      {/* Optional: Hover Arrow */}
      <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all duration-300">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}