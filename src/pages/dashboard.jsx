import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/api/api";

import StatCard from "../components/DashboardComponents/StatCard";
import SalesChartCard from "../components/DashboardComponents/SalesChartCard";
import OrderCard from "../components/DashboardComponents/OrderCard";
import SalesChart from "../components/DashboardComponents/SalesChart";
import OrderSidePanelOrders from "../components/pos/OrderSidePanelOrders";

export default function Dashboard() {
  const qc = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  // ✅ Fetch Dashboard Stats + Today Orders
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/restaurant/dashboard/stats");
      // console.log("Dashboard Stats:", res.data);
      return res.data;
    },
    refetchInterval: 7000,
  });

  const raw = data ?? {};
  const stats = raw.data ?? raw;
  const orders = stats.orders ?? [];

  // ✅ Update Order
  const updateOrder = useMutation({
    mutationFn: async (payload) =>
      api.post("/restaurant/orders/update", payload),
    onSuccess: () => {
      qc.invalidateQueries(["dashboardStats"]);
      setOpenPanel(false);
    },
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
    <div>
      {/* HEADER */}
      <div className="bg-gray block dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold dark:text-white">Dashboard</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3">
        {/* ✅ LEFT - Stats + Graph */}
        <div className="col-span-2 p-4">
          <h1 className="text-xl font-semibold dark:text-white mb-4 px-4">
            Statistics
          </h1>

          <div className="grid xl:grid-cols-2 gap-4">
            <StatCard
              title="Today's Orders"
              value={stats.todayOrders ?? 0}
              isUp
            />
            <StatCard
              title="Today's Earnings"
              value={`₹${stats.todayEarnings ?? 0}`}
              isUp
            />
            <StatCard
              title="Today's Customers"
              value={stats.todayCustomers ?? 0}
            />
            <StatCard
              title="Avg Daily Earnings"
              value={`₹${stats.avgDailyEarnings ?? 0}`}
              isUp
            />
          </div>

          <div className="mt-6">
            <SalesChartCard
              value={`₹${stats.todayEarnings ?? 0}`}
              percent="12"
              subtitle="Sales Last 7 Days"
            >
              <SalesChart data={stats.salesChart ?? []} />
            </SalesChartCard>
          </div>
        </div>

        {/* ✅ RIGHT - Today Orders List */}
        <div className="p-4 flex flex-col gap-3 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-900/20">
          <div className="p-4 flex flex-col gap-3">
            <h1 className="text-xl font-semibold dark:text-white mb-4">
              Today Orders
            </h1>

            {isLoading ? (
              <p className="text-gray-400">Loading orders...</p>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  table={order.table?.table_no ?? "N/A"}
                  orderNo={order.id}
                  status={order.status}
                  paymentStatus={order.payment_status}
                  time={new Date(order.created_at).toLocaleString()}
                  items={`${order.items?.length ?? 0} Item(s)`}
                  total={order.total_amount}
                  customer={order.customer}
                  orderType={order.order_type ?? ""} // ✅ FIX — now passed!
                  onClick={() => {
                    setSelectedOrder(order);
                    setOpenPanel(true);
                  }}
                />
              ))
            ) : (
              <p className="text-gray-400">No orders today</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ EDIT PANEL */}
      <OrderSidePanelOrders
        open={openPanel}
        onClose={() => {
          setOpenPanel(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />
    </div>
  );
}
