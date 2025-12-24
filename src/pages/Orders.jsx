import React, { useState } from "react";
import OrderSidePanelOrders from "../components/pos/OrderSidePanelOrders";
import OrderCard from "../components/DashboardComponents/OrderCard";
import useOrdersManager from "@/hooks/useOrdersManager";

export default function Orders() {
  const [page, setPage] = useState(1);
  const [dateRangeType, setDateRangeType] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const {
  ordersQuery,
  selectedOrder,
  setSelectedOrder,
  openPanel,
  setOpenPanel,
  handleSaveOrder,
} = useOrdersManager({
  queryKey: [
    "orders",
    page,
    dateRangeType,
    startDate,
    endDate,
    status,
    paymentStatus,
  ],
  fetchParams: () => ({
    page,
    per_page: 6,
    dateRangeType,
    startDate,
    endDate,
    status,
    payment_status: paymentStatus,
  }),
});


  const orders = ordersQuery.data?.data ?? [];
  const pagination = ordersQuery.data?.pagination ?? {};

  /* ✅ SINGLE LOADING CHECK */
  // if (ordersQuery.isLoading) {
  //   return <p className="text-gray-400 p-6">Loading...</p>;
  // }

  return (
    <div className="p-6 dark:bg-gray-800">
      <h1 className="text-xl font-semibold dark:text-white">
        Orders ({pagination.total ?? 0})
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={dateRangeType}
          onChange={(e) => setDateRangeType(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="currentMonth">Current Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="custom">Custom Date</option>
        </select>

        {dateRangeType === "custom" && (
          <>
            <input
              type="date"
              className="bg-gray-700 text-white px-3 py-2 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="bg-gray-700 text-white px-3 py-2 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="kot">KOT</option>
          <option value="preparing">Preparing</option>
          <option value="served">Served</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded"
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Orders Grid */}
      {orders.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="cursor-pointer"
              onClick={() => {
                setSelectedOrder(order);
                setOpenPanel(true);
              }}
            >
              <OrderCard
                table={order.table?.table_no ?? "-"}
                orderNo={order.id}
                status={order.status}
                paymentStatus={order.payment_status}
                time={new Date(order.created_at).toLocaleString()}
                items={`${order.items?.length || 0} Item(s)`}
                total={order.total_amount}
                customer={order.customer}
                orderType={order.order_type}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No orders found</p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-300">
          Page {pagination.current_page ?? page} of{" "}
          {pagination.last_page ?? 1}
        </span>

        <button
          disabled={page === pagination.last_page}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Side Panel */}
      <OrderSidePanelOrders
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />
    </div>
  );
}
