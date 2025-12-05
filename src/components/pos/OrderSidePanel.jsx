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
    order_note: "",              // ⭐ NEW
  });

  // Load order/cart
  useEffect(() => {
    if (order) {
      setOrderData((prev) => ({
        ...prev,
        items: order.items?.map((i) => ({
          ...i,
          qty: i.qty || i.quantity || 1,
          item_note: i.item_note || "",     // ⭐ NEW
        })) || [],
        table_id: order.table_id || null,
        table_no: order.table_no || null,
      }));
    }
  }, [order]);

  // Total calculation
  const totals = useMemo(() => {
    let sub = 0, count = 0;

    orderData.items.forEach((it) => {
      sub += Number(it.qty) * Number(it.price);
      count += Number(it.qty);
    });

    return { count, total: sub };
  }, [orderData.items]);

  // Qty Update
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

  // Item Note Update
  const updateItemNote = (id, note) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id ? { ...it, item_note: note } : it
      ),
    }));
  };

  // Remove Item
  const removeItem = (id) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  // CREATE ORDER API
  const createOrder = async () => {
    if (!orderData.items.length) return toast.error("No items added!");

    if (orderData.order_type === "dine_in" && !orderData.table_id)
      return toast.error("Please select a table");

    try {
      const payload = {
        order_type: orderData.order_type,
        table_id: orderData.order_type === "dine_in" ? orderData.table_id : null,
        customer_name: orderData.customer_name || null,
        customer_phone: orderData.customer_phone || null,
        order_note: orderData.order_note || null,     // ⭐ NEW
        items: orderData.items.map((i) => ({
          menu_item_id: i.id,
          quantity: i.qty,
          item_note: i.item_note || null,            // ⭐ NEW
        })),
      };

      await api.post("/restaurant/orders/create", payload);
      playSound();
      toast.success("order Created successfully")

      // reset
      setOrderData({
        items: [],
        table_id: null,
        table_no: null,
        order_type: "dine_in",
        customer_name: "",
        customer_phone: "",
        order_note: "",
      });
    } catch (err) {
      // console.error(err);
      // alert("Order creation failed");
      toast.error("Order Creation Failed")
    }
  };

  return (
    <aside className="h-full bg-gray-800 text-white flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Create Order</h2>
      </div>

      {/* Order Type */}
      <div className="p-4 border-b border-gray-700">
        <label className="text-sm">Order Type</label>
        <select
          className="bg-gray-700 p-2 rounded w-full"
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

      {/* Customer */}
      <div className="p-4 border-b border-gray-700">
        <label className="text-sm">Customer Details</label>

        <input
          className="bg-gray-700 p-2 rounded mt-2 w-full"
          type="text"
          placeholder="Customer Name"
          value={orderData.customer_name}
          onChange={(e) =>
            setOrderData((o) => ({ ...o, customer_name: e.target.value }))
          }
        />

        <input
          className="bg-gray-700 p-2 rounded mt-2 w-full"
          type="tel"
          placeholder="Phone Number"
          maxLength="10"
          value={orderData.customer_phone}
          onChange={(e) =>
            setOrderData((o) => ({ ...o, customer_phone: e.target.value }))
          }
        />
      </div>

      {/* Order Note */}
      <div className="p-4 border-b border-gray-700">
        <label className="text-sm">Order Note</label>
        <textarea
          className="bg-gray-700 p-2 rounded w-full mt-2"
          rows={2}
          placeholder="Eg: No Onion, Make Spicy"
          value={orderData.order_note}
          onChange={(e) =>
            setOrderData((o) => ({ ...o, order_note: e.target.value }))
          }
        ></textarea>
      </div>

      {/* Table only for dine-in */}
      {orderData.order_type === "dine_in" && (
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">
            Table: {orderData.table_no || "Select Table"}
          </h2>
        </div>
      )}

      {/* ITEMS */}
      <div className="p-4 overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orderData.items.length ? (
              orderData.items.map((it) => (
                <React.Fragment key={it.id}>
                  <tr className="border-t border-gray-700">
                    <td className="p-2">{it.name}</td>

                    <td className="p-2 text-center">
                      <button
                        className="border px-2 py-1"
                        onClick={() => updateQty(it.id, "dec")}
                      >
                        -
                      </button>
                      <span className="px-2">{it.qty}</span>
                      <button
                        className="border px-2 py-1"
                        onClick={() => updateQty(it.id, "inc")}
                      >
                        +
                      </button>
                    </td>

                    <td className="p-2 text-right">₹{it.qty * it.price}</td>

                    <td className="p-2 text-right">
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>

                  {/* Item note row */}
                  <tr className="border-b border-gray-800">
                    <td colSpan={4} className="px-2 pb-2">
                      <textarea
                        className="bg-gray-700 p-2 rounded w-full text-xs"
                        rows={1}
                        placeholder="Item note (optional)"
                        value={it.item_note}
                        onChange={(e) => updateItemNote(it.id, e.target.value)}
                      ></textarea>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
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
          className="w-full bg-green-600 py-2 mt-3 rounded"
          onClick={createOrder}
        >
          CREATE ORDER
        </button>
      </div>
    </aside>
  );
}
