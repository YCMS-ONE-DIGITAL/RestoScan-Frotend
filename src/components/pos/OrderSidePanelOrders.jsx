import React, { useState, useEffect, useMemo } from "react";
import api from "@/api/api";   // ⭐ REQUIRED for baseURL

export default function OrderSidePanelOrders({ open, onClose, order, onSave }) {
  const [orderData, setOrderData] = useState({
    id: null,
    items: [],
    table_id: null,
    table_no: null,
    status: "",
    payment_status: "",
    payment_method: "",
    order_note: "",
  });

  const [deletedItems, setDeletedItems] = useState([]);

  // Load order when clicked
  useEffect(() => {
    if (order) {
      setOrderData({
        id: order.id,
        items:
          order.items?.map((i) => ({
            ...i,
            quantity: i.quantity,
            item_note: i.item_note || "",
          })) || [],
        table_id: order.table_id || null,
        table_no: order.table?.table_no || "---",
        customer: order.customer || null,
        status: order.status || "",
        payment_status: order.payment_status || "",
        payment_method: order.payment_method || "",
        order_note: order.order_note || "",
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

  // Update Item Note
  const updateItemNote = (id, text) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id ? { ...it, item_note: text } : it
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

  // ⭐ PRINT BILL (FINAL FIX)
  const handlePrintBill = () => {
    if (!orderData.id) return;

    const BILL_URL = `${api.defaults.baseURL}/restaurant/orders/${orderData.id}/bill`;

    // window.open(BILL_URL, "_blank");
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = BILL_URL;

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

    document.body.appendChild(iframe);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}></div>
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-96 bg-gray-800 text-white transform transition-all duration-300 z-50 
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Customer Details */}
        {order?.customer && (
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Customer Details</h2>
            <p className="text-gray-300 mt-2">
              <strong>Name:</strong> {order.customer.name}
            </p>
            <p className="text-gray-300 mt-1">
              <strong>Phone:</strong> {order.customer.phone}
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

        {/* Order Note */}
        <div className="px-3 py-3 border-b border-gray-700">
          <label className="text-gray-300 text-sm">Order Note</label>
          <textarea
            className="w-full mt-2 p-2 bg-gray-700 rounded"
            rows={2}
            placeholder="Eg: More spicy, No onion"
            value={orderData.order_note}
            onChange={(e) =>
              setOrderData((prev) => ({
                ...prev,
                order_note: e.target.value,
              }))
            }
          ></textarea>
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
                <th className="p-2 text-right">Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orderData.items.length ? (
                orderData.items.map((it) => (
                  <React.Fragment key={it.id}>
                    <tr className="border-t border-gray-700">
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

                      <td className="p-2 text-right">₹{it.price * it.quantity}</td>

                      <td className="p-2">
                        <button
                          className="text-red-500 text-xs"
                          onClick={() => removeItem(it.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>

                    {/* Item Note */}
                    <tr className="border-b border-gray-700">
                      <td colSpan={4} className="px-2 pb-2">
                        <textarea
                          className="w-full bg-gray-700 p-2 rounded text-xs"
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
                  <td className="text-center p-4 text-gray-400" colSpan="4">
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

          {/* Print Bill */}
          {["served", "completed"].includes(orderData.status) && (
            <button
              className="w-full bg-blue-600 mt-4 py-2 rounded"
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
