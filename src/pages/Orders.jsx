import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderSidePanel from "../components/pos/OrderSidePanel";
import OrderCard from "../components/DashboardComponents/OrderCard";

const Orders = () => {
  const navigate = useNavigate();
  const [dateRangeType, setDateRangeType] = useState("today");
  const [startDate, setStartDate] = useState("2025-11-07");
  const [endDate, setEndDate] = useState("2025-11-07");
  const [filterOrders, setFilterOrders] = useState("");
  const [openPanel, setOpenPanel] = useState(false);

  // Dummy
  const orders = [
    { id: 7, status: "Paid", items: 1, total: 400, time: "November 07, 2025 13:27 PM" },
  ];

  const handleSaveOrder = (mode, payload) => {
    console.log("SAVE ORDER:", mode, payload);
    // TODO: call API here
    setOpenPanel(false);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 dark:border-gray-700 relative">
      {/* Header */}
      <div className="flex mb-4">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Orders ({orders.length})
        </h1>
      </div>

      {/* Filters */}
      <div className="items-center justify-between block sm:flex">
        <div className="lg:flex items-center mb-4 sm:mb-0">
          <div className="lg:flex gap-2 items-center">
            <select
              value={dateRangeType}
              onChange={(e) => setDateRangeType(e.target.value)}
              className="border-gray-300 focus:ring-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="today">Today</option>
              <option value="currentWeek">Current Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="last7Days">Last 7 Days</option>
              <option value="currentMonth">Current Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="currentYear">Current Year</option>
              <option value="lastYear">Last Year</option>
            </select>

            <div className="flex items-center w-full">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-gray-300 text-gray-800 px-2 py-2 rounded"
              />
              <span className="mx-4 text-gray-500">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-gray-300 text-gray-800 px-2 py-2 rounded"
              />
            </div>
          </div>

          <select
            value={filterOrders}
            onChange={(e) => setFilterOrders(e.target.value)}
            className="border-gray-300 focus:ring-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-900 dark:text-gray-300 text-sm ml-4"
          >
            <option value="">Show All Orders</option>
            <option value="kot">KOT</option>
            <option value="billed">Billed</option>
            <option value="paid">Paid</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* New Order opens SIDE PANEL */}
        <button
          onClick={() => setOpenPanel(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg"
        >
          + New Order
        </button>
      </div>

      {/* Orders list (demo) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <OrderCard
                            table="T01"
                            orderNo="3"
                            status="KOT"
                            statusText="Cooking Now"
                            time="November 06, 2025 11:07 AM"
                            items="1 Item(s)"
                            total="$200"
                        />
      </div>

      {/* SIDE PANEL */}
      <OrderSidePanel
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        onSave={handleSaveOrder}
      />
    </div>
  );
};

export default Orders;
