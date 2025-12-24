import React, { useState, useEffect, useMemo } from "react";
import api from "@/api/api";
import AddItemModal from "../AddItemModal";

export default function OrderSidePanelOrders({ open, onClose, order, onSave }) {
  const [orderData, setOrderData] = useState({
    id: null,
    items: [],
    table_id: null,
    table_no: "---",
    status: "",
    payment_status: "",
    payment_method: "",
    order_note: "",
    customer: null,
  });

  const[showAddItem, setShowAddItem] = useState(false)
  const [deletedItems, setDeletedItems] = useState([]);

  useEffect(() => {
    if (!order) return;

    setOrderData({
      id: order.id,
      items:
        order.items?.map((i) => ({
          ...i,
          quantity: Number(i.quantity),
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

    setDeletedItems([]);
  }, [order]);

  const totals = useMemo(() => {
    let total = 0;
    let count = 0;
    orderData.items.forEach((it) => {
      const qty = Number(it.quantity);
      total += qty * Number(it.price);
      count += qty;
    });
    return { count, total };
  }, [orderData.items]);

  const updateQty = (id, type) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id
          ? {
              ...it,
              quantity: type === "inc" ? it.quantity + 1 : Math.max(1, it.quantity - 1),
            }
          : it
      ),
    }));
  };



  const updateItemNote = (id, note) => {
    setOrderData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, item_note: note } : it)),
    }));
  };

 const removeItem = (item) => {
  // UI मधून remove
  setOrderData((prev) => ({
    ...prev,
    items: prev.items.filter((i) => i.id !== item.id),
  }));

  // ⭐ फक्त DB item delete list मध्ये
  if (!item.is_new) {
    setDeletedItems((prev) => [...prev, item.id]);
  }
};


  const handleSave = () => {
    onSave(orderData, deletedItems);
    onClose();
  };

  const handlePrintBill = () => {
    if (!orderData.id) return;

    const BILL_URL = `${api.defaults.baseURL}/restaurant/orders/${orderData.id}/bill`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.src = BILL_URL;

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };

    document.body.appendChild(iframe);
  };


  
  const handleAddItem = (newItems) => {
  console.log("SIDE PANEL → received:", newItems); // 🔴 ADD THIS

  setOrderData((prev) => {
    const items = [...prev.items];

    newItems.forEach((item) => {
      console.log("ADDING ITEM:", item); // 🔴 ADD THIS

      const index = items.findIndex(
        (i) => i.menu_item_id === item.id
      );

      if (index !== -1) {
        items[index] = {
          ...items[index],
          quantity: items[index].quantity + item.quantity,
        };
      } else {
        items.push({
          id: `new-${item.id}-${Date.now()}`,
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          item_note: "",
          is_new: true,
        });
      }
    });

    return { ...prev, items };
  });
};



  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Side Panel - Old Theme */}
      <aside className="fixed top-0 right-0 h-full w-96 bg-gray-800 text-white flex flex-col z-50">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Table: {orderData.table_no}
          </h2>
          <button
            onClick={onClose}
            className="text-xl hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Customer Details */}
            {orderData.customer && (
              <div className="border-b border-gray-700 pb-4">
                <h3 className="font-medium mb-2">Customer Details</h3>
                <p className="text-sm text-gray-300">
                  <strong>Name:</strong> {orderData.customer.name}
                </p>
                <p className="text-sm text-gray-300">
                  <strong>Phone:</strong> {orderData.customer.phone}
                </p>
                {orderData.customer.email && (
                  <p className="text-sm text-gray-300">
                    <strong>Email:</strong> {orderData.customer.email}
                  </p>
                )}
              </div>
            )}

            {/* Order Note */}
            <div>
              <label className="text-sm text-gray-300">Order Note</label>
              <textarea
                className="w-full mt-1 p-2 bg-gray-700 rounded text-sm"
                rows={2}
                placeholder="Eg: More spicy, No onion"
                value={orderData.order_note}
                onChange={(e) =>
                  setOrderData((p) => ({ ...p, order_note: e.target.value }))
                }
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-300">Order Status</label>
              <select
                className="w-full mt-1 p-2 bg-gray-700 rounded"
                value={orderData.status}
                onChange={(e) => setOrderData((p) => ({ ...p, status: e.target.value }))}
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
            <div>
              <label className="text-sm text-gray-300">Payment Status</label>
              <select
                className="w-full mt-1 p-2 bg-gray-700 rounded"
                value={orderData.payment_status}
                onChange={(e) =>
                  setOrderData((p) => ({ ...p, payment_status: e.target.value }))
                }
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm text-gray-300">Payment Method</label>
              <select
                className="w-full mt-1 p-2 bg-gray-700 rounded"
                value={orderData.payment_method}
                onChange={(e) =>
                  setOrderData((p) => ({ ...p, payment_method: e.target.value }))
                }
              >
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>

            {/* Items Table */}
            <div>
                        {/* ADD ITEM */}

               <button
  onClick={() => setShowAddItem(true)}
  className="mb-3 w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded text-sm font-medium"
>
  + Add Item
</button>
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
                 
                  {orderData.items.length > 0 ? (
                    orderData.items.map((it) => (
                      <React.Fragment key={it.id}>
                        <tr className="border-t border-gray-700">
                          <td className="p-2">
                            {it.menu_item?.name || it.name || "Unknown Item"}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              className="border px-2 py-1 mx-1"
                              onClick={() => updateQty(it.id, "dec")}
                            >
                              -
                            </button>
                            <span className="mx-2">{it.quantity}</span>
                            <button
                              className="border px-2 py-1 mx-1"
                              onClick={() => updateQty(it.id, "inc")}
                            >
                              +
                            </button>
                          </td>
                          <td className="p-2 text-right">
                            ₹{(it.quantity * it.price).toFixed(2)}
                          </td>
                          <td className="p-2 text-right">
                            <button
                              className="text-red-500 text-xs"
                              onClick={() => removeItem(it)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="px-2 pb-3">
                            <textarea
                              className="w-full bg-gray-700 p-2 rounded text-xs"
                              rows={1}
                              placeholder="Item note (optional)"
                              value={it.item_note}
                              onChange={(e) => updateItemNote(it.id, e.target.value)}
                            />
                          </td>
                        </tr>
                        {/* Add Item Button */}

                      </React.Fragment>
                      
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-400">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer - Always Visible */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700 space-y-3">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{totals.count}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{totals.total.toFixed(2)}</span>
          </div>

          {["served", "completed"].includes(orderData.status) && (
            <button
              onClick={handlePrintBill}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition"
            >
              Print / Download Bill
            </button>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-medium transition"
          >
            SAVE CHANGES
          </button>
        </div>
      </aside>
      <AddItemModal
  open={showAddItem}
  onClose={() => setShowAddItem(false)}
  onAdd={handleAddItem}
/>

    </>
  );
}