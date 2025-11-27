// src/CustomerWebsite/pages/OrderHistory.jsx
import { useState, useEffect } from "react";
import { Package, ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import Footer from "./Footer";
import { useCart } from "../context/CardContext";

import { decryptData } from "@/utils/encryption";

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { clearCart } = useCart();

useEffect(() => {
  clearCart();
}, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    let decoded;
    try {
      decoded = decryptData(atob(token));
    } catch {
      console.error("Invalid token");
      return;
    }

    if (!decoded.phone || !decoded.restaurant_id) return;

    const fetchOrders = async () => {
      try {
        const res = await api.post("/public/order/orderhistory", {
          phone: decoded.phone,
          restaurant_id: decoded.restaurant_id,
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("ORDER HISTORY ERROR:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
            Back
          </button>
          <h1 className="font-bold text-lg text-gray-800">My Orders</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "orders" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Orders
            </div>
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "items" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Items List
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === "orders" ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No orders yet</p>
            ) : (
              orders.map((order) => {
                const d = new Date(order.created_at);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">#{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {d.toLocaleDateString()} •{" "}
                          {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status === "completed" ? (
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 inline mr-1" />
                        )}
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">{order.items.length} items</p>
                      <p className="font-bold text-orange-600">₹{order.total_amount}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No items ordered</p>
            ) : (
              orders.flatMap((order) =>
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.menu_item.name}</p>
                      <p className="text-xs text-gray-500">Order #{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {item.quantity} × ₹{item.price}
                      </p>
                      <p className="text-sm font-bold text-orange-600">
                        ₹{item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
