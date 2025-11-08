import React, { useState } from "react";
import OrderSidePanel from "../components/pos/OrderSidePanel";
import OrderCard from "../components/DashboardComponents/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 7,
      orderNo: 7,
      table: "T01",
      status: "KOT",
      statusText: "Cooking Now",
      items: [
        { id: 1, name: "Margherita Pizza", qty: 1, price: 200 },
        { id: 2, name: "Coke", qty: 2, price: 40 }
      ],
      total: 280,
      pax: 2,
      orderType: "dine_in",
      time: "November 07, 2025 13:27 PM"
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  // ✅ When card clicked → open panel with that order
  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setOpenPanel(true);
  };

  // ✅ Save updated order back to list
  const handleSaveOrder = (mode, updatedOrder) => {
    console.log("SAVE ORDER:", mode, updatedOrder);

    setOrders(prev =>
      prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setOpenPanel(false);
  };

  return (
    <div className="p-4  dark:bg-gray-800 relative">
      <h1 className="text-xl font-semibold dark:text-white">Orders ({orders.length})</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="cursor-pointer"
            onClick={() => handleCardClick(order)}
          >
            <OrderCard
              table={order.table}
              orderNo={order.orderNo}
              status={order.status}
              statusText={order.statusText}
              time={order.time}
              items={`${order.items.length} Item(s)`}
              total={`₹${order.total}`}
            />
          </div>
        ))}
      </div>

      {/* ✅ Side Panel */}
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
