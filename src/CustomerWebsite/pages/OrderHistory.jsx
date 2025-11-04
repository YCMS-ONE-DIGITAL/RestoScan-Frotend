// src/CustomerWebsite/pages/OrderHistoryPage.jsx
import { useState, useEffect } from "react";
import { Package, ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Demo Orders (real app मध्ये API call येईल)
  useEffect(() => {
    const demoOrders = [
      {
        id: "ORD001",
        date: "Nov 4, 2025",
        time: "7:30 PM",
        items: 3,
        total: 849,
        status: "Delivered",
        itemsList: [
          { name: "Pepperoni Pizza", qty: 1, price: 349 },
          { name: "Cold Coffee", qty: 2, price: 149 },
        ],
      },
      {
        id: "ORD002",
        date: "Nov 3, 2025",
        time: "1:15 PM",
        items: 2,
        total: 548,
        status: "Preparing",
        itemsList: [
          { name: "Chicken Burger", qty: 1, price: 249 },
          { name: "Chicken Wings", qty: 1, price: 299 },
        ],
      },
    ];
    setOrders(demoOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="bg-white shadow-sm px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
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
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "orders"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Orders
            </div>
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === "items"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Items List
            </div>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4">
        {activeTab === "orders" ? (
          /* ORDERS TAB */
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No orders yet</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">#{order.id}</p>
                      <p className="text-xs text-gray-500">
                        {order.date} • {order.time}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "Delivered" ? (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">{order.items} items</p>
                    <p className="font-bold text-orange-600">₹{order.total}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* ITEMS LIST TAB */
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No items ordered</p>
            ) : (
              orders.flatMap((order) =>
                order.itemsList.map((item, idx) => (
                  <div
                    key={`${order.id}-${idx}`}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Order #{order.id} • {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {item.qty} × ₹{item.price}
                      </p>
                      <p className="text-sm font-bold text-orange-600">
                        ₹{item.qty * item.price}
                      </p>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        )}
      </div>

      <Footer/>
    </div>
  );
}