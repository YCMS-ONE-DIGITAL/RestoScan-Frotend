import React, { useState, useEffect, useMemo } from "react";
import api from "@/api/api";

export default function OrderSidePanel({ order }) {
  const [orderData, setOrderData] = useState({
    items: [],
    table_id: null,
    table_no: null,
    order_type: "dine_in", // ✅ must match DB ENUM
    customer_name: "",
    customer_phone: "",
  });

  // ✅ Load cart/order data smoothly
  useEffect(() => {
    if (order) {
      setOrderData((prev) => ({
        ...prev,
        items: order.items || [],
        table_id: order.table_id || null,
        table_no: order.table_no || null,
      }));
    }
  }, [order]);

  // ✅ Total Calculation
  const totals = useMemo(() => {
    let sub = 0;
    let count = 0;

    orderData.items.forEach((it) => {
      const qty = Number(it.qty) || 1;
      const price = Number(it.price) || 0;
      sub += qty * price;
      count += qty;
    });

    return { count, total: sub };
  }, [orderData.items]);

  // ✅ Qty Update
  const updateQty = (id, type) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id
          ? {
              ...it,
              qty: type === "inc" ? Number(it.qty) + 1 : Math.max(1, Number(it.qty) - 1),
            }
          : it
      ),
    }));
  };

  // ✅ Remove item
  const removeItem = (id) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  // ✅ CREATE ORDER API CALL
  const createOrder = async () => {
    if (orderData.items.length === 0) {
      alert("No items added!");
      return;
    }

    // ✅ Dine-in requires table
    if (orderData.order_type === "dine_in" && !orderData.table_id) {
      alert("Please select a table");
      return;
    }

    try {
      const payload = {
        order_type: orderData.order_type,
        table_id: orderData.order_type === "dine_in" ? Number(orderData.table_id) : null,
        customer_name: orderData.customer_name || null,
        customer_phone: orderData.customer_phone || null,
        items: orderData.items.map((i) => ({
          menu_item_id: i.id,
          quantity: Number(i.qty),
        })),
      };

      const res = await api.post("/restaurant/orders/create", payload);

      alert("Order created successfully!");
      console.log("ORDER RESPONSE:", res.data);

    } catch (err) {
      console.error(err);
      alert("Order creation failed");
    }
  };

  return (
    <aside className="h-full bg-gray-800 text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Create Order</h2>
      </div>

      {/* ✅ Order Type Selector */}
      <div className="p-4 flex flex-col gap-2 border-b border-gray-700">
        <label className="text-sm text-gray-300">Order Type</label>
        <select
          className="bg-gray-700 p-2 rounded"
          value={orderData.order_type}
          onChange={(e) =>
            setOrderData((o) => ({ ...o, order_type: e.target.value }))
          }
        >
          <option value="dine_in">Dine-In</option>
          <option value="parcel">Parcel</option>
          <option value="delivery">Delivery</option>
        </select>
      </div>

      {/* ✅ Customer Fields */}
      <div className="px-4 py-2 flex flex-col gap-2 border-b border-gray-700">
        <label className="text-sm text-gray-300">Customer (Optional)</label>

        <input
          type="text"
          placeholder="Customer Name"
          className="bg-gray-700 p-2 rounded"
          value={orderData.customer_name}
          onChange={(e) =>
            setOrderData((o) => ({ ...o, customer_name: e.target.value }))
          }
        />

        <input
          type="tel"
          placeholder="Phone Number"
          maxLength="10"
          className="bg-gray-700 p-2 rounded"
          value={orderData.customer_phone}
          onChange={(e) =>
            setOrderData((o) => ({ ...o, customer_phone: e.target.value }))
          }
        />
      </div>

      {/* ✅ Show table only for dine-in */}
      {orderData.order_type === "dine_in" && (
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">
            Table: {orderData.table_no || "Select Table"}
          </h2>
        </div>
      )}

      {/* ITEMS */}
      <div className="p-4 flex overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orderData.items.length ? (
              orderData.items.map((it) => (
                <tr key={it.id} className="border-t border-gray-700">
                  <td className="p-2">{it.name}</td>

                  <td className="p-2 text-center">
                    <button className="border p-1 border-gray-400" onClick={() => updateQty(it.id, "dec")}>-</button>
                    <span className="px-2">{it.qty}</span>
                    <button className="border p-1 border-gray-400" onClick={() => updateQty(it.id, "inc")}>+</button>
                  </td>

                  <td className="p-2 text-right">₹{it.price}</td>
                  <td className="p-2 text-right">₹{it.qty * it.price}</td>

                  <td className="p-2 text-right">
                    <button
                      onClick={() => removeItem(it.id)}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-400" colSpan="5">
                  No Items Added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex justify-between">
          <span>Items</span>
          <span>{totals.count}</span>
        </div>

        <div className="flex justify-between">
          <span>Total</span>
          <span>₹{totals.total}</span>
        </div>

        <button
          className="w-full bg-green-600 mt-4 py-2 rounded"
          onClick={createOrder}
        >
          CREATE ORDER
        </button>
      </div>

    </aside>
  );
}
