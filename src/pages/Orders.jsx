import React, { useState } from "react";
import OrderSidePanel from "../components/pos/OrderSidePanel";
import OrderCard from "../components/DashboardComponents/OrderCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";

const Orders = () => {
  const qc = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  // ✅ Fetch all orders of logged in restaurant
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders?restaurant_id=3"); // ⭐ restaurant_id from auth
      return res.data.data;
    },
  });

  // ✅ Update order mutation
  const updateOrder = useMutation({
    mutationFn: async (payload) => {
      return api.post("/order/update", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries(["orders"]);
      setOpenPanel(false);
    },
  });

  // 👉 When card clicked → open panel
  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setOpenPanel(true);
  };

  // 👉 Save from panel → call update API
  const handleSaveOrder = (mode, updatedOrder) => {
    updateOrder.mutate({
      order_id: updatedOrder.id,
      status: updatedOrder.status,
      payment_status: updatedOrder.payment_status,
      payment_method: updatedOrder.payment_method,
    });
  };

  return (
    <div className="p-4 dark:bg-gray-800 relative">
      <h1 className="text-xl font-semibold dark:text-white">
        Orders ({orders.length})
      </h1>

      {/* Loading State */}
      {isLoading ? (
        <p className="mt-4 text-gray-400">Loading orders...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="cursor-pointer"
              onClick={() => handleCardClick(order)}
            >
              <OrderCard
                table={order.table?.name || "Table"}
                orderNo={order.id}
                status={order.status}
                statusText={order.status}
                time={order.created_at}
                items={`${order.items?.length || 0} Item(s)`}
                total={`₹${order.total_amount}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* 👉 Side Panel */}
      <OrderSidePanel
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        onSave={handleSaveOrder}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;
