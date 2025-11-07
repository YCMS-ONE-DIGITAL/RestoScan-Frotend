import React, { useState, useMemo } from "react";

export default function OrderSidePanel({ open, onClose, onSave }) {
  // --- Form state ---
  const [orderType, setOrderType] = useState("dine_in"); // dine_in | delivery | pickup
  const [noOfPax, setNoOfPax] = useState(1);
  const [waiter, setWaiter] = useState("");
  const [items, setItems] = useState([]); // [{id,name,qty,price}]
  const [orderNo] = useState(8); // demo

  // --- Totals ---
  const totals = useMemo(() => {
    const sub = items.reduce((sum, it) => sum + it.qty * it.price, 0);
    return {
      count: items.reduce((c, it) => c + it.qty, 0),
      subTotal: sub,
      total: sub, // add taxes/charges if you want
    };
  }, [items]);

  // --- Handlers (demo placeholders) ---
  const handleKOT = () => {
    onSave?.("kot", { orderType, noOfPax, waiter, items });
  };
  const handleBill = () => {
    onSave?.("bill", { orderType, noOfPax, waiter, items });
  };

  // Drawer classes
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 h-full z-[70] w-full max-w-[480px] bg-white dark:bg-gray-800 dark:border-l dark:border-gray-700 shadow-xl transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="h-full flex flex-col pr-4 px-2 py-4">
          {/* Header Row */}
          <div className="flex justify-between my-2 items-center">
            <div className="font-medium py-2 inline-flex items-center gap-2 dark:text-neutral-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-receipt w-6 h-6" viewBox="0 0 16 16">
                <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z"/>
                <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
              </svg>
              Order #{orderNo}
            </div>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert("Assign Table clicked")}
                className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Assign Table
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Close
              </button>
            </div>
          </div>

          {/* Order type radios */}
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {[
              { id: "dine_in", label: "Dine In" },
              { id: "delivery", label: "Delivery" },
              { id: "pickup", label: "Pickup" },
            ].map((o) => (
              <li key={o.id} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 cursor-pointer">
                <label className="flex items-center ps-3 py-3">
                  <input
                    type="radio"
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-2"
                    name="orderType"
                    checked={orderType === o.id}
                    onChange={() => setOrderType(o.id)}
                  />
                  <span className="ms-2 text-sm">{o.label}</span>
                </label>
              </li>
            ))}
          </ul>

          {/* pax, waiter, notes btn */}
          <div className="flex justify-between mb-2 items-center gap-2 mt-3">
            <div className="py-2 inline-flex items-center gap-2 text-sm dark:text-gray-300">
              <span>Pax</span>
              <input
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-gray-500 rounded-md shadow-sm w-20 text-sm px-2 py-1"
                type="number"
                min={1}
                value={noOfPax}
                onChange={(e) => setNoOfPax(Number(e.target.value || 1))}
              />
            </div>
            <div className="gap-2 inline-flex items-center">
              <button
                type="button"
                onClick={() => alert("KOT Note clicked")}
                className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square mr-2" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z"/>
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5z"/>
                </svg>
                KOT Note
              </button>

              <select
                className="border-gray-300 rounded-md shadow-sm bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 text-sm w-40 px-2 py-2"
                value={waiter}
                onChange={(e) => setWaiter(e.target.value)}
              >
                <option value="">Select Waiter</option>
                <option value="12">FoodNest</option>
              </select>
            </div>
          </div>

          {/* Items table */}
          <div className="flex-1 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">Item Name</th>
                  <th className="p-2 text-xs text-center text-gray-500 uppercase dark:text-gray-400">QTY</th>
                  <th className="p-2 text-xs font-medium text-right text-gray-500 uppercase dark:text-gray-400 hidden lg:block">Price</th>
                  <th className="p-2 text-xs font-medium text-right text-gray-500 uppercase dark:text-gray-400">Amount</th>
                  <th className="p-2 text-xs font-medium text-gray-500 uppercase dark:text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.length === 0 ? (
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">
                    <td className="p-3" colSpan={5}>
                      No record found
                    </td>
                  </tr>
                ) : (
                  items.map((it) => (
                    <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-2">{it.name}</td>
                      <td className="p-2 text-center">{it.qty}</td>
                      <td className="p-2 text-right hidden lg:block">₹{it.price}</td>
                      <td className="p-2 text-right">₹{it.qty * it.price}</td>
                      <td className="p-2 text-right">
                        <button
                          className="text-red-600 text-xs"
                          onClick={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary + Actions */}
          <div className="mt-3">
            <div className="p-4 select-none text-center w-full bg-gray-50 rounded space-y-3 dark:bg-gray-700">
              <div className="flex justify-between text-gray-500 text-sm dark:text-neutral-400">
                <span>Item(s)</span>
                <span>{totals.count}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm dark:text-neutral-400">
                <span>Sub Total</span>
                <span>₹{totals.subTotal}</span>
              </div>
              <div className="flex justify-between font-medium dark:text-neutral-300">
                <span>Total</span>
                <span>₹{totals.total}</span>
              </div>
            </div>

            <div className="pb-2 pt-3 select-none text-center w-full">
              <div className="flex gap-2">
                <button className="rounded bg-gray-700 text-white w-full p-2" onClick={handleKOT}>
                  KOT
                </button>
                <button className="rounded bg-indigo-600 text-white w-full p-2" onClick={handleBill}>
                  BILL
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
