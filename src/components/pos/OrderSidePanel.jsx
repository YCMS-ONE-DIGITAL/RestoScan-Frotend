import React, { useState, useEffect, useMemo } from "react";

export default function OrderSidePanel({ open, onClose, onSave, order }) {
  // ✅ 1. Load data dynamically when "order" changes
  const [orderData, setOrderData] = useState({
    id: null,
    orderNo: "",
    orderType: "dine_in",
    pax: 1,
    waiter: "",
    items: [],
    table: "",
  });

  useEffect(() => {
    if (order) {
      setOrderData({
        id: order.id,
        orderNo: order.orderNo,
        orderType: order.orderType || "dine_in",
        pax: order.pax || 1,
        waiter: order.waiter || "",
        items: order.items || [],
        table: order.table || "",
      });
    }
  }, [order]);

  // ✅ 2. Totals calculation
  const totals = useMemo(() => {
    const sub = orderData.items.reduce((sum, it) => sum + it.qty * it.price, 0);
    return {
      count: orderData.items.reduce((c, it) => c + it.qty, 0),
      subTotal: sub,
      total: sub,
    };
  }, [orderData.items]);

  // ✅ 3. Update handlers
  const updateItemQty = (id, type) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id
          ? { ...it, qty: type === "inc" ? it.qty + 1 : it.qty > 1 ? it.qty - 1 : 1 }
          : it
      ),
    }));
  };

  const removeItem = (id) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  // ✅ 4. Save KOT or BILL
  const handleSave = (mode) => {
    const updatedOrder = {
      ...orderData,
      total: totals.total,
    };
    onSave?.(mode, updatedOrder);
  };

  if (!order) return null; // panel does nothing if no order is selected

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <aside
  className={`fixed top-0 right-0 w-full sm:max-w-lg h-full bg-gray-800 dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
    open ? "translate-x-0" : "translate-x-full"
  }`}
>
  {/* Header */}
  <div className="flex justify-between items-center p-4 border-b border-gray-700">
    <h2 className="text-lg font-semibold text-white">
      Order #{orderData.orderNo} {orderData.table ? `• Table ${orderData.table}` : ""}
    </h2>
    <button onClick={onClose} className="text-gray-400 hover:text-white">✖</button>
  </div>

  {/* Scrollable Body */}
  <div className="flex-1 overflow-y-auto p-4">
    {/* 🔹 Order Status Dropdown */}
    <div className="mb-4">
      <label className="text-gray-400 text-sm">Order Status</label>
      <select
        value={orderData.status || "kot"}
        onChange={(e) => {
          const newStatus = e.target.value;
          setOrderData((prev) => ({ ...prev, status: newStatus }));
          console.log("Order Status Changed:", newStatus); // ← Call API here if needed
        }}
        className="mt-1 w-full border-gray-600 bg-gray-900 text-gray-300 text-sm rounded-md focus:border-gray-400 focus:ring-gray-500"
      >
        <option value="kot">KOT</option>
        <option value="billed">Billed</option>
        <option value="paid">Paid</option>
        <option value="canceled">Canceled</option>
        <option value="out_for_delivery">Out For Delivery</option>
        <option value="delivered">Delivered</option>
      </select>
    </div>

    {/* Items Table */}
    <div className="border border-gray-700 rounded">
      <table className="w-full">
        <thead className="bg-gray-700 text-gray-300">
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-center">Qty</th>
            <th className="p-2 text-right">Price</th>
            <th className="p-2 text-right">Amount</th>
            <th className="p-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {orderData.items.length > 0 ? (
            orderData.items.map((it) => (
              <tr key={it.id} className="border-t border-gray-700">
                <td className="p-2 text-white">{it.name}</td>
                <td className="p-2 text-center text-white">
                  <button onClick={() => updateItemQty(it.id, "dec")}>-</button>
                  <span className="px-2">{it.qty}</span>
                  <button onClick={() => updateItemQty(it.id, "inc")}>+</button>
                </td>
                <td className="p-2 text-right text-white">₹{it.price}</td>
                <td className="p-2 text-right text-white">₹{it.price * it.qty}</td>
                <td className="p-2 text-right">
                  <button onClick={() => removeItem(it.id)} className="text-red-500 text-xs">
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center p-4 text-gray-400" colSpan={5}>
                No Items
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* 🔹 Fixed Footer: Totals + Buttons */}
  <div className="border-t border-gray-700 bg-gray-800 p-4">
    <div className="flex justify-between text-gray-400 text-sm">
      <span>Items</span><span>{totals.count}</span>
    </div>
    <div className="flex justify-between text-gray-400 text-sm">
      <span>Sub Total</span><span>₹{totals.subTotal}</span>
    </div>
    <div className="flex justify-between text-white font-medium mt-2">
      <span>Total</span><span>₹{totals.total}</span>
    </div>

    <div className="flex gap-2 mt-4">
      <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
        onClick={() => handleSave("kot")}
      >
        KOT
      </button>
      <button className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded"
        onClick={() => handleSave("bill")}
      >
        BILL
      </button>
    </div>
  </div>
</aside>


    </>
  );
}
