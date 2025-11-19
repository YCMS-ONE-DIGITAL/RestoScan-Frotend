import React, { useState } from "react";
import OrderSidePanelOrders from "../components/pos/OrderSidePanelOrders";
import OrderCard from "../components/DashboardComponents/OrderCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";

const Orders = () => {
  const qc = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/restaurant/orders/fetchall?restaurant_id=3");
      return res.data.data;
    },
  });

  // ⭐ Update order API call
  const updateOrder = useMutation({
    mutationFn: async (payload) =>
      api.post("/restaurant/orders/update", payload), // ⭐ Correct URL
    onSuccess: () => {
      qc.invalidateQueries(["orders"]);
      setOpenPanel(false);
    },
  });

  // ⭐ Open panel
  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setOpenPanel(true);
  };

  // ⭐ Save button clicked (from sidebar)
  const handleSaveOrder = (updatedOrder,deletedItems = []) => {
    if (!updatedOrder) return;

    console.log("PAYLOAD:", updatedOrder);

    updateOrder.mutate({
      order_id: updatedOrder.id,
      status: updatedOrder.status,
      payment_status: updatedOrder.payment_status,
      payment_method: updatedOrder.payment_method,

      // UPDATED ITEMS
      items: updatedOrder.items.map((it) => ({
        order_item_id: it.id,
        quantity: it.quantity,
        price: it.price,
      })),
              // ⭐ THIS IS THE DELETE PART

          deleted_items: deletedItems,

    });
  };

  return (
    <div className="p-4 dark:bg-gray-800 relative">
      <h1 className="text-xl font-semibold dark:text-white">
        Orders ({orders.length})
      </h1>

      {isLoading ? (
        <p className="text-gray-400 mt-4">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="cursor-pointer"
              onClick={() => handleCardClick(order)}
            >
              <OrderCard
                table={order.table?.table_no || "-"}
                orderNo={i + 1}
                status={order.payment_status}
                statusText={order.status}
                time={order.created_at}
                items={`${order.items?.length || 0} Item(s)`}
                total={`₹${order.total_amount}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Sidebar */}
      <OrderSidePanelOrders
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        order={selectedOrder}
        onSave={handleSaveOrder} // ⭐ Only ONE argument
      />
    </div>
  );
};

export default Orders;
