// Dashboard.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import api from "@/api/api";
import toast from "react-hot-toast";

import StatCard from "../components/DashboardComponents/StatCard";
import SalesChartCard from "../components/DashboardComponents/SalesChartCard";
import OrderCard from "../components/DashboardComponents/OrderCard";
import SalesChart from "../components/DashboardComponents/SalesChart";
import OrderSidePanelOrders from "../components/pos/OrderSidePanelOrders";
import { playSound } from "../components/Playsound";

import useOrdersManager from "@/hooks/useOrdersManager";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const location = useLocation();

  /* =========================
     ORDER PANEL STATE
  ========================= */
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  /* =========================
     NEW ORDER SOUND TRACKER
  ========================= */
  const [lastOrderCount, setLastOrderCount] = useState(0);

  /* =========================
     SOUND UNLOCK (UNCHANGED)
  ========================= */
  useEffect(() => {
    const dummy = new Audio("/sounds/ordersound.mp3");
    dummy.volume = 0;

    const unlock = () => {
      dummy.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  /* =========================
     DASHBOARD STATS QUERY
  ========================= */
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/restaurant/dashboard/stats");
      return res.data;
    },
    refetchInterval: 7000,
  });

  const raw = data ?? {};
  const stats = raw.data ?? raw;
  const orders = stats.orders ?? [];

  /* =========================
     GLOBAL NEW ORDER DETECTOR
  ========================= */
  useEffect(() => {
    if (!orders.length) return;

    const currentCount = orders.length;

    if (lastOrderCount === 0) {
      setLastOrderCount(currentCount);
      return;
    }

    if (currentCount > lastOrderCount) {
      playSound();
      toast.success("🔥 New Order Received!");
    }

    setLastOrderCount(currentCount);
  }, [orders]);

  /* =========================
     ORDER UPDATE (HOOK)
  ========================= */
  const { handleSaveOrder } = useOrdersManager({
    queryKey: ["dashboardStats"],
    fetchParams: () => ({}), // not used here, but required by hook
  });

  /* =========================
     UI
  ========================= */
  return (
    <div>
      {/* HEADER */}
      <div className="bg-gray block dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold dark:text-white">
            Dashboard
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3">
        {/* LEFT – STATS */}
        <div className="col-span-2 p-4">
          <h1 className="text-xl font-semibold dark:text-white mb-4 px-4">
            Statistics
          </h1>

          <div className="grid xl:grid-cols-2 gap-4">
            <StatCard title="Today's Orders" value={stats.todayOrders ?? 0} isUp />
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

        {/* RIGHT – TODAY ORDERS */}
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
                  orderType={order.order_type ?? ""}
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

      {/* ORDER SIDE PANEL */}
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
