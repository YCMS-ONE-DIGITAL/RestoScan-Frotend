import React, { useState,useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import toast from "react-hot-toast";


import OrderCard from "../components/DashboardComponents/OrderCard";
import OrderSidePanelOrders from "../components/pos/OrderSidePanelOrders";
import { playSound } from "../components/Playsound";

export default function KOT() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [dateRangeType, setDateRangeType] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  // ✅ Pagination State
  const [page, setPage] = useState(1);

  // ⭐ NEW ORDER DETECTOR FOR KOT PAGE
const lastKotCount = useRef(null);



  // ✅ Fetch orders based on filters + pagination
  const { data, isLoading } = useQuery({
    queryKey: ["kotOrders", page, dateRangeType, startDate, endDate],
    queryFn: async () => {
      const res = await api.get("/restaurant/orders/filter", {
        params: { page, per_page: 9, dateRangeType, startDate, endDate },
      });
      return res.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const orders = data?.data ?? [];
  const pagination = data?.pagination ?? {};


  
useEffect(() => {
  if (!orders) return;

  const kotOnly = orders.filter(o => o.status === "kot");
  const current = kotOnly.length;

  // first load – don't alert
  if (lastKotCount.current === null) {
    lastKotCount.current = current;
    return;
  }

  // NEW KOT ARRIVED 🔥
  if (current > lastKotCount.current) {
    playSound();
    toast.success("🧾 New KOT Received!");
  }

  lastKotCount.current = current;
}, [orders]);
  // ✅ Update Order
  const updateOrder = useMutation({
    mutationFn: (payload) => api.post("/restaurant/orders/update", payload),
    onSuccess: () => {
      qc.invalidateQueries(["kotOrders"]);
      playSound()
      toast.success("Order updated Successfully")
      setOpenPanel(false);
    },
    onError:()=>{
      toast.error("Failed to Update Order")
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

  // ✅ Hide pending orders + apply filter
  const displayedOrders = orders
    .filter((o) => o.status !== "pending") // ✅ remove pending
    .filter((o) => {
      if (!statusFilter) return true;
      return o.status === statusFilter;
    });

  return (
    <div className="p-4 bg-gray dark:bg-gray-800 dark:border-gray-700">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold dark:text-white">
          Orders ({pagination.total ?? displayedOrders.length})
        </h1>

        <button
          onClick={() => navigate("/pos")}
          className="bg-orange-600 text-white px-5 py-2.5 rounded-lg"
        >
          + New Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">

        {/* Date Range Dropdown */}
        <select
          value={dateRangeType}
          onChange={(e) => setDateRangeType(e.target.value)}
          className="bg-gray-900 text-gray-200 px-3 py-2 rounded-md border border-gray-600"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="currentMonth">Current Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {/* Custom Date Range */}
        {dateRangeType === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded"
            />
          </div>
        )}

        {/* Status filters */}
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1 rounded-md border ${
            statusFilter === "" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-300"
          }`}
        >
          All ({orders.filter(o => o.status !== "pending").length})
        </button>

          

        <button
          onClick={() => setStatusFilter("kot")}
          className={`px-3 py-1 rounded-md border ${
            statusFilter === "kot" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-300"
          }`}
        >
          kot({orders.filter(o => o.status === "kot").length})
        </button>
        <button
          onClick={() => setStatusFilter("preparing")}
          className={`px-3 py-1 rounded-md border ${
            statusFilter === "preparing" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-300"
          }`}
        >
          In Kitchen ({orders.filter(o => o.status === "preparing").length})
        </button>
        

        <button
          onClick={() => setStatusFilter("served")}
          className={`px-3 py-1 rounded-md border ${
            statusFilter === "served" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-300"
          }`}
        >
          Served ({orders.filter(o => o.status === "served").length})
        </button>

        <button
          onClick={() => setStatusFilter("completed")}
          className={`px-3 py-1 rounded-md border ${
            statusFilter === "completed" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-300"
          }`}
        >
          Completed ({orders.filter(o => o.status === "completed").length})
        </button>
      </div>

      {/* Orders List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {isLoading ? (
          <p className="text-gray-400">Loading orders...</p>
        ) : displayedOrders.length > 0 ? (
          displayedOrders.map((order) => (
            <OrderCard
              key={order.id}
              table={order.table?.table_no ?? "N/A"}
              orderNo={order.id}
              orderType={order.order_type}
              status={order.status}
              paymentStatus={order.payment_status}
              time={new Date(order.created_at).toLocaleString()}
              items={`${order.items?.length ?? 0} Item(s)`}
              total={`₹${order.total_amount}`}
              onClick={() => {
                setSelectedOrder(order);
                setOpenPanel(true);
              }}
            />
          ))
        ) : (
          <p className="text-gray-400">No matching orders</p>
        )}
      </div>

      {/* ✅ Pagination Section */}
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

      {/* Order Edit Panel */}
      <OrderSidePanelOrders
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />
    </div>
  );
}
