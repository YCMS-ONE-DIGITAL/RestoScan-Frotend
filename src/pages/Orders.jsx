import React, { useState } from "react";
import OrderSidePanelOrders from "../components/pos/OrderSidePanelOrders";
import OrderCard from "../components/DashboardComponents/OrderCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { playSound } from "../components/Playsound";
import api from "@/api/api";

export default function Orders() {
  const qc = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  // ✅ Pagination state
  const [page, setPage] = useState(1);

  // ✅ Filters state
  const [dateRangeType, setDateRangeType] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // ✅ Fetch orders with pagination + filters
  const { data, isLoading } = useQuery({
    queryKey: [
      "orders",
      page,
      dateRangeType,
      startDate,
      endDate,
      status,
      paymentStatus,
    ],
    queryFn: async () => {
      const res = await api.get("/restaurant/orders/filter", {
        params: {
          page,
          per_page: 6,
          dateRangeType,
          startDate,
          endDate,
          status,          // ✅ now sending status
           payment_status: paymentStatus,   // ✅ now sending payment filter
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const orders = data?.data ?? [];
  const pagination = data?.pagination ?? {};

  // ✅ Update order
  const updateOrder = useMutation({
    mutationFn: async (payload) => api.post("/restaurant/orders/update", payload),
    onSuccess: () => {
      qc.invalidateQueries(["orders"]);
                  playSound();
      toast.success("Order Updated Successfully")
      setOpenPanel(false);

    },
    onError:()=>{
      toast.error("Failed to update Order")
    }
  });

  const handleSaveOrder = (updatedOrder, deletedItems = []) => {
    updateOrder.mutate({
      order_id: updatedOrder.id,
      status: updatedOrder.status,
      payment_status: updatedOrder.payment_status,
      payment_method: updatedOrder.payment_method,
       order_note: updatedOrder.order_note,
      items: updatedOrder.items.map((it) => ({
        order_item_id: it.id,
        quantity: it.quantity,
        item_note: it.item_note,
      })),
      deleted_items: deletedItems,
    });
  };

  return (
    <div className="p-6 dark:bg-gray-800 ">
      <h1 className="text-xl font-semibold dark:text-white">
        Orders ({pagination.total ?? 0})
      </h1>

      {/* ✅ Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Date Range Filter */}
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

        {/* Custom Dates */}
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

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="kot">KOT</option> {/* ✅ Added */}
          <option value="preparing">Preparing</option>
          <option value="served">Served</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Filter */}
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

      {/* ✅ Orders List */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : orders.length ? (
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
                orderType={order.order_type} // ✅ shows dine_in, parcel, KOT, etc.
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No orders found</p>
      )}

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-gray-300">
          Page {pagination.current_page ?? page} of {pagination.last_page ?? 1}
        </span>

        <button
          disabled={page === pagination.last_page}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* ✅ Update Panel */}
      <OrderSidePanelOrders
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />
    </div>
  );
}
