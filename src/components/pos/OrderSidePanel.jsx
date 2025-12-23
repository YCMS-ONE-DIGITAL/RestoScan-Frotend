import React, { useState, useEffect, useMemo } from "react";
import api from "@/api/api";
import toast from "react-hot-toast";
import { playSound } from "../Playsound";

export default function OrderSidePanel({ order }) {
  const [orderData, setOrderData] = useState({
    items: [],
    table_id: null,
    table_no: null,
    order_type: "dine_in",
    customer_name: "",
    customer_phone: "",
    order_note: "",
  });

  const [showCustomer, setShowCustomer] = useState(false);
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    if (order) {
      setOrderData((prev) => ({
        ...prev,
        items: order.items?.map((i) => ({
          ...i,
          qty: i.qty || i.quantity || 1,
          item_note: i.item_note || "",
        })) || [],
        table_id: order.table_id || null,
        table_no: order.table_no || null,
      }));

      if (order.customer_name || order.customer_phone) setShowCustomer(true);
      if (order.order_note) setShowNote(true);
    }
  }, [order]);

  const totals = useMemo(() => {
    let sub = 0, count = 0;
    orderData.items.forEach((it) => {
      sub += Number(it.qty) * Number(it.price);
      count += Number(it.qty);
    });
    return { count, total: sub };
  }, [orderData.items]);

  const updateQty = (id, type) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id
          ? { ...it, qty: type === "inc" ? it.qty + 1 : Math.max(1, it.qty - 1) }
          : it
      ),
    }));
  };

  const updateItemNote = (id, note) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id ? { ...it, item_note: note } : it
      ),
    }));
  };

  const removeItem = (id) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const createOrder = async () => {
    if (!orderData.items.length) return toast.error("No items added!");
    if (orderData.order_type === "dine_in" && !orderData.table_id)
      return toast.error("Please select a table");

    try {
      const payload = {
        order_type: orderData.order_type,
        table_id: orderData.order_type === "dine_in" ? orderData.table_id : null,
        customer_name: showCustomer ? orderData.customer_name || null : null,
        customer_phone: showCustomer ? orderData.customer_phone || null : null,
        order_note: showNote ? orderData.order_note || null : null,
        items: orderData.items.map((i) => ({
          menu_item_id: i.id,
          quantity: i.qty,
          item_note: i.item_note || null,
        })),
      };

      await api.post("/restaurant/orders/create", payload);
      playSound();
      toast.success("Order Created Successfully!");

      setOrderData({
        items: [],
        table_id: null,
        table_no: null,
        order_type: "dine_in",
        customer_name: "",
        customer_phone: "",
        order_note: "",
      });
      setShowCustomer(false);
      setShowNote(false);
    } catch (err) {
      toast.error("Order Creation Failed");
    }
  };

  return (
    <aside className="h-full bg-slate-900 text-white flex flex-col min-h-0">
      {/* HEADER - Fixed */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-800">
        <h2 className="text-xl font-bold">Create Order</h2>
      </div>

      {/* BODY - Scrollable (Main Content) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Order Type */}
          <div>
            <label className="text-sm uppercase text-slate-400 mb-2 block">Order Type</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none"
              value={orderData.order_type}
              onChange={(e) => setOrderData((o) => ({ ...o, order_type: e.target.value }))}
            >
              <option value="dine_in">Dine-In</option>
              <option value="parcel">Parcel</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {/* Table Info */}
          {orderData.order_type === "dine_in" && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Selected Table</p>
              <p className="text-xl font-semibold">
                {orderData.table_no || "No table selected"}
              </p>
              {!orderData.table_no && (
                <p className="text-sm text-red-400 mt-2">Please select a table</p>
              )}
            </div>
          )}

          {/* Customer */}
          <div>
            {showCustomer ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Customer Details</h3>
                  <button
                    onClick={() => {
                      setShowCustomer(false);
                      setOrderData((o) => ({ ...o, customer_name: "", customer_phone: "" }));
                    }}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Customer Name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none"
                  value={orderData.customer_name}
                  onChange={(e) => setOrderData((o) => ({ ...o, customer_name: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  maxLength="10"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none"
                  value={orderData.customer_phone}
                  onChange={(e) => setOrderData((o) => ({ ...o, customer_phone: e.target.value }))}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowCustomer(true)}
                className="w-full py-3 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-white transition"
              >
                + Add Customer
              </button>
            )}
          </div>

          {/* Order Note */}
          <div>
            {showNote ? (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Order Note</h3>
                  <button
                    onClick={() => {
                      setShowNote(false);
                      setOrderData((o) => ({ ...o, order_note: "" }));
                    }}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Eg: No onion, extra spicy..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 resize-none focus:border-indigo-500 outline-none"
                  value={orderData.order_note}
                  onChange={(e) => setOrderData((o) => ({ ...o, order_note: e.target.value }))}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowNote(true)}
                className="w-full py-3 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-white transition"
              >
                + Add Note
              </button>
            )}
          </div>

          {/* Items List */}
          <div>
            <p className="text-sm uppercase text-slate-400 mb-4">Order Items</p>
            {orderData.items.length > 0 ? (
              <div className="space-y-4 pb-20"> {/* Extra bottom padding for safety */}
                {orderData.items.map((it) => (
                  <div key={it.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-lg">{it.name}</h4>
                      <span className="font-bold text-indigo-400">
                        ₹{(it.qty * it.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center bg-slate-700 rounded-full overflow-hidden">
                        <button onClick={() => updateQty(it.id, "dec")} className="px-4 py-2 hover:bg-slate-600 text-lg transition">−</button>
                        <span className="px-8 py-2 font-semibold text-lg">{it.qty}</span>
                        <button onClick={() => updateQty(it.id, "inc")} className="px-4 py-2 hover:bg-slate-600 text-lg transition">+</button>
                      </div>
                      <button onClick={() => removeItem(it.id)} className="text-red-400 hover:text-red-300 px-4 py-2 hover:bg-slate-700 rounded-lg font-medium">
                        Remove
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Item note (optional)"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm resize-none focus:border-indigo-500 outline-none"
                      value={it.item_note}
                      onChange={(e) => updateItemNote(it.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <p className="text-lg">No items added yet</p>
                <p className="text-sm mt-2">Add items from the menu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER - Always Visible */}
      <div className="flex-shrink-0 border-t border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex justify-between text-lg">
          <span className="text-slate-400">Total Items</span>
          <span className="font-semibold">{totals.count}</span>
        </div>
        <div className="flex justify-between text-2xl font-bold">
          <span>Grand Total</span>
          <span className="text-indigo-400">₹{totals.total.toFixed(2)}</span>
        </div>
        <button
          onClick={createOrder}
          className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold text-lg transition"
        >
          CREATE ORDER
        </button>
      </div>
    </aside>
  );
}