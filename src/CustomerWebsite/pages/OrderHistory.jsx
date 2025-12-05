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
  const [decoded, setDecoded] = useState(null);

  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Clear cart
  useEffect(() => {
    clearCart();
  }, []);

  // Decode token & save to state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) return;

    try {
      const d = decryptData(atob(token));
      setDecoded(d);              // ⭐ MOST IMPORTANT
    } catch {
      console.error("Invalid token");
    }
  }, []);

  // Load orders when decoded ready
  useEffect(() => {
    if (!decoded?.phone || !decoded?.restaurant_id) return;

    const fetchOrders = async () => {
      try {
        const res = await api.post("/public/order-history", {
          phone: decoded.phone,
          restaurant_id: decoded.restaurant_id,
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("ORDER HISTORY ERROR:", err);
      }
    };

    fetchOrders();
  }, [decoded]);

  if (!decoded) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading your orders...
      </div>
    );
  }

  return (
<div className="h-screen  bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
            Back
          </button>
          <h1 className="font-bold text-lg text-gray-800">My Orders</h1>
          <div className="w-6" />
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "orders" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4" /> Orders
            </div>
          </button>

          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "items" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Items List
            </div>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4 overflow-y-auto"   style={{ height: "calc(100vh - 200px)" }}
>                     <h5 className="center text-center">Refresh the page after sometime  to see the Order Status</h5>
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

                    {order.order_note && (
                      <p className="text-xs text-gray-500 mt-2">
                        📝 <span className="font-medium">Order Note:</span> {order.order_note}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.flatMap((order) =>
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.menu_item.name}</p>
                    <p className="text-xs text-gray-500">Order #{order.id}</p>

                    {item.item_note && (
                      <p className="text-xs text-gray-500 mt-1">📝 Note: {item.item_note}</p>
                    )}
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
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <Footer
        restaurantId={decoded.restaurant_id}
        restaurantName={decoded.restaurant_name}
        tableNo={decoded.table_no}
        tableId={decoded.table_id}
      />
    </div>
  );
}
