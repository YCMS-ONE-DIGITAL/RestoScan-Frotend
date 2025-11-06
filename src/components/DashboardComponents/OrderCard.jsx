import React from "react";

export default function OrderCard({
  table ,
  orderNo,
  status,  // "Paid" | "KOT" | "Pending"
  statusText,
  time ,items,
  total,
  onClick,
}) {
  // Status Badge Colors
  const statusStyles = {
    Paid: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-300 border border-green-400",
    KOT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300 border border-yellow-400",
    Pending: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-300 border border-red-400",
  };

  // Status Dot Color
  const dotColor = {
    Paid: "text-green-500",
    KOT: "text-yellow-400",
    Pending: "text-red-500",
  };

  return (
    <a
      onClick={onClick}
      className="group flex flex-col gap-3 items-center border bg-gray-800 shadow-sm rounded-lg hover:shadow-md transition dark:bg-gray-700 dark:border-gray-600 p-3 cursor-pointer w-full"
    >
      {/* Top Section */}
      <div className="flex gap-4 justify-between w-full">
        {/* Table */}
        <div className="flex gap-3">
          <div className="p-3 rounded-lg bg-gray-600 text-white inline-flex items-center">
            <h3 className="font-semibold">{table}</h3>
          </div>
          <div>
            <div className="font-medium text-gray-300 text-sm">
              Order #{orderNo}
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="text-right flex flex-col">
          {/* Status Box - FIX ✅ */}
          <span className={`text-xs font-medium px-3 py-1 rounded uppercase tracking-wide whitespace-nowrap ${statusStyles[status]}`}>
            {status}
          </span>

          {/* Status Text Below */}
          <div className="text-xs text-gray-400 mt-1 inline-flex gap-1 items-center">
            <svg width="8" height="8" className={dotColor[status]} viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="8" />
            </svg>
            {statusText}
          </div>
        </div>
      </div>

      {/* Time and Items */}
      <div className="flex w-full justify-between items-center text-xs text-gray-400">
        <span>{time}</span>
        <span className="text-sm font-medium">{items}</span>
      </div>

      {/* Footer – Total */}
      <div className="flex w-full justify-between items-center border-t pt-3">
        <span className="text-sm font-medium text-gray-300">Total</span>
        <span className="text-lg font-medium text-white">{total}</span>
      </div>
    </a>
  );
}
