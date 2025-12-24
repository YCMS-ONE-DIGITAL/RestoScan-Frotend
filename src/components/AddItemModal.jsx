import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function AddItemModal({ open, onClose, onAdd }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});

  useEffect(() => {
    if (!open) return;

    api.get("/restaurant/menu/item/list/all").then((res) => {
      setItems(res.data.data || []);
    });
  }, [open]);

  if (!open) return null;

  /* Local Cart Logic */
  const addItem = (item) => {
    setCart((p) => ({
      ...p,
      [item.id]: (p[item.id] || 0) + 1,
    }));
  };

  const updateQty = (item, type) => {
    setCart((p) => {
      const newQty =
        type === "inc" ? (p[item.id] || 1) + 1 : (p[item.id] || 1) - 1;

      if (newQty <= 0) {
        const copy = { ...p };
        delete copy[item.id];
        return copy;
      }
      return { ...p, [item.id]: newQty };
    });
  };

  /* Done & Cancel */
  const handleDone = () => {
    const selectedItems = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = items.find((i) => i.id == itemId);
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: qty,
        };
      });

    onAdd(selectedItems);
    setCart({});
    onClose();
  };

  const handleCancel = () => {
    setCart({});
    onClose();
  };

  /* Veg/Non-Veg Badge */
  const VegNonVegBadge = ({ is_veg }) => (
    <div
      className={`
        w-4 h-4 rounded-sm border-2 flex items-center justify-center
        ${is_veg 
          ? "border-green-500 bg-green-500/20" 
          : "border-red-500 bg-red-500/20"
        }
      `}
    >
      <div
        className={`
          w-2 h-2 rounded-sm
          ${is_veg ? "bg-green-500" : "bg-red-500"}
        `}
      />
    </div>
  );

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-end sm:items-center justify-center">
      {/* MODAL */}
      <div className="
        bg-gray-800 text-white
        w-full sm:max-w-lg
        h-[90vh] sm:h-auto sm:max-h-[80vh]
        rounded-t-3xl sm:rounded-2xl
        flex flex-col
        shadow-2xl
      ">
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold">Add Items</h3>
          <button
            onClick={handleCancel}
            className="text-3xl font-light hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition sm:hidden"
          >
            ×
          </button>
        </div>

        {/* SEARCH */}
        <div className="px-5 pt-4">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-gray-700 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ITEMS LIST - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-lg">No items found</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const qty = cart[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-700 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Veg/Non-Veg Badge */}
                    <VegNonVegBadge is_veg={item.is_veg} />

                    <div className="flex-1">
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-gray-300">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  {qty === 0 ? (
                    <button
                      onClick={() => addItem(item)}
                      className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg font-medium text-sm transition"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-gray-600 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQty(item, "dec")}
                        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-lg font-bold transition"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{qty}</span>
                      <button
                        onClick={() => updateQty(item, "inc")}
                        className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center text-lg font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-gray-700 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl bg-gray-600 hover:bg-gray-500 font-medium transition hidden sm:block"
          >
            Cancel
          </button>

          <button
            onClick={handleDone}
            disabled={Object.keys(cart).length === 0}
            className={`
              flex-1 py-3 rounded-xl font-bold transition
              ${Object.keys(cart).length === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
              }
            `}
          >
            Done ({Object.values(cart).reduce((a, b) => a + b, 0)} items)
          </button>
        </div>
      </div>
    </div>
  );
}