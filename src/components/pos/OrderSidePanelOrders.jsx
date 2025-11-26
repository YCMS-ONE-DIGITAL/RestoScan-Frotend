import React, { useState, useEffect, useMemo } from "react";

export default function OrderSidePanelOrders({ open, onClose, order, onSave }) {
  const [orderData, setOrderData] = useState({
    items: [],
    table_id: null,
    table_no: null,
    status: "",
    payment_status: "",
    payment_method: "",
  });

  const [deletedItems, setDeletedItems] = useState([]);

  // Load order when clicked
  useEffect(() => {
    if (order) {
      setOrderData({
        id: order.id,
        items: order.items || [],
        table_id: order.table_id || null,
        table_no: order.table?.table_no || "---",
        customer: order.customer || null,
        status: order.status || "",
        payment_status: order.payment_status || "",
        payment_method: order.payment_method || "",
      });
    }
  }, [order]);

  // Calculate totals
  const totals = useMemo(() => {
    let total = 0;
    let count = 0;

    orderData.items.forEach((it) => {
      const qty = Number(it.quantity);
      const price = Number(it.price);
      total += qty * price;
      count += qty;
    });

    return { count, total };
  }, [orderData.items]);

  // Qty Update
  const updateQty = (id, type) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id
          ? {
              ...it,
              quantity:
                type === "inc"
                  ? Number(it.quantity) + 1
                  : Number(it.quantity) > 1
                  ? Number(it.quantity) - 1
                  : 1,
            }
          : it
      ),
    }));
  };

  // Remove Item
  const removeItem = (id) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));

    setDeletedItems((prev) => [...prev, id]);
  };

  // Save changes
  const handleSave = () => {
    onSave(orderData, deletedItems);
  };

  // ✅ Print / Download Bill
  const handlePrintBill = () => {
    if (!orderData.id) return;
    window.open(`restaurant/orders/${orderData.id}/bill`, "_blank");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-96 bg-gray-800 text-white transform transition-all duration-300 z-50 
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ✅ Customer Details */}
        {order?.customer && (
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Customer Details</h2>

            <p className="text-gray-300 mt-2">
              <span className="font-medium text-white">Name:</span> {order.customer.name}
            </p>

            <p className="text-gray-300 mt-1">
              <span className="font-medium text-white">Phone:</span> {order.customer.phone}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between">
          <h2 className="text-lg font-semibold">
            Table: {orderData.table_no}
          </h2>

          <button
            onClick={onClose}
            className="text-white text-xl hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* Order Status */}
        <div className="px-3">
          <label className="text-gray-300 text-sm">Order Status</label>
          <select
            className="w-full mt-1 p-2 bg-gray-700 rounded"
            value={orderData.status}
            onChange={(e) =>
              setOrderData((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="pending">Pending</option>
            <option value="kot">KOT</option>
            <option value="preparing">Preparing</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="px-3">
          <label className="text-gray-300 text-sm">Payment Status</label>
          <select
            className="w-full mt-1 p-2 bg-gray-700 rounded"
            value={orderData.payment_status}
            onChange={(e) =>
              setOrderData((prev) => ({ ...prev, payment_status: e.target.value }))
            }
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="px-3">
          <label className="text-gray-300 text-sm">Payment Method</label>
          <select
            className="w-full mt-1 p-2 bg-gray-700 rounded"
            value={orderData.payment_method}
            onChange={(e) =>
              setOrderData((prev) => ({ ...prev, payment_method: e.target.value }))
            }
          >
            <option value="">Select</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Items List */}
        <div className="p-4 ">
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
                    <td className="p-2">
                      {it.menu_item?.name ||
                        it.menuItem?.name ||
                        it.item?.name ||
                        it.name ||
                        "Unknown Item"}
                    </td>

                    <td className="p-2 text-center">
                      <button onClick={() => updateQty(it.id, "dec")}>-</button>
                      <span className="px-2">{it.quantity}</span>
                      <button onClick={() => updateQty(it.id, "inc")}>+</button>
                    </td>

                    <td className="p-2 text-right">₹{it.price}</td>

                    <td className="p-2 text-right">
                      ₹{it.price * it.quantity}
                    </td>

                    <td className="p-2">
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => removeItem(it.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center p-4 text-gray-400" colSpan="5">
                    No Items Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{totals.count}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span>Total</span>
            <span>₹{totals.total}</span>
          </div>

          {/* ✅ Print / Download Bill Button */}
          {["served", "completed"].includes(orderData.status) && (
            <button
              className="w-full bg-blue-600 mt-4 py-2 rounded hover:bg-blue-700"
              onClick={handlePrintBill}
            >
              Print / Download Bill
            </button>
          )}

          <button
            className="w-full bg-green-600 mt-2 py-2 rounded"
            onClick={handleSave}
          >
            SAVE CHANGES
          </button>
        </div>
      </aside>
    </>
  );
}
