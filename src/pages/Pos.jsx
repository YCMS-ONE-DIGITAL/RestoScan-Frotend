import React, { useState } from "react";
import MenuSearchBar from "../components/pos/MenuSearchBar";
import CategoryFilter from "../components/pos/CategoryFilter";
import MenuGrid from "../components/pos/MenuGrid";
import CreateOrderSidePanel from "../components/pos/CreateOrderSidePanel"; // ✅ NEW
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

const POS = () => {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const [selectedTable, setSelectedTable] = useState("");
  const [selectedTableNumber, setSelectedTableNumber] = useState("");

  const [showMobileCart, setShowMobileCart] = useState(false);

  /* ================= RESTAURANT ================= */
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await api.get("/restaurant/show");
      return res.data.restaurant;
    },
  });

  /* ================= TABLES ================= */
  const { data: tables = [] } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await api.get(
        `/restaurant/table/list?restaurant_id=${restaurant?.id}`
      );
      return res.data.data ?? [];
    },
    enabled: !!restaurant?.id,
  });

  const handleSelectTable = (tableId) => {
    setSelectedTable(tableId);
    const tbl = tables.find((t) => t.id == tableId);
    setSelectedTableNumber(tbl?.table_no || "");
  };

  return (
    <>
      {/* OVERLAY (mobile cart) */}
      {showMobileCart && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setShowMobileCart(false)}
        />
      )}

      <div className="flex h-full text-white overflow-hidden">
        {/* ================= LEFT MENU ================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* HEADER */}
          <div className="flex-shrink-0 p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <MenuSearchBar search={search} setSearch={setSearch} />

            <select
  className="bg-gray-800 text-white px-3 py-2 rounded w-full sm:w-auto"
  value={selectedTable}
  onChange={(e) => handleSelectTable(e.target.value)}
>
  <option value="">Select Table</option>

  {tables.map((t) => (
    <option
      key={t.id}
      value={t.id}
      disabled={t.status === "occupied"} // optional
    >
      {t.table_no} — {t.seating_number} Seats ({t.status})
    </option>
  ))}
</select>

            </div>

            <CategoryFilter
              filterCat={filterCat}
              setFilterCat={setFilterCat}
            />
          </div>

          {/* MENU GRID */}
          <div className="flex-1 overflow-y-auto px-4 pb-24">
            <MenuGrid
              search={search}
              filterCat={filterCat}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          </div>
        </div>

        {/* ================= RIGHT PANEL (DESKTOP) ================= */}
        <div className="hidden lg:flex w-96 flex-col border-l border-gray-700">
          <CreateOrderSidePanel
            order={{
              items: cartItems,
              table_id: selectedTable,
              table_no: selectedTableNumber,
            }}
          />
        </div>

        {/* ================= MOBILE CART BUTTON ================= */}
        <button
          onClick={() => setShowMobileCart(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full shadow-2xl z-50 flex items-center gap-3 text-lg font-semibold"
        >
          <span>Cart</span>
          <span className="bg-green-700 px-3 py-1 rounded-full text-sm">
            {cartItems.length}
          </span>
        </button>

        {/* ================= MOBILE CART DRAWER ================= */}
        {showMobileCart && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50">
            <div className="bg-slate-900 rounded-t-3xl shadow-2xl h-[85vh] flex flex-col">
              {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b border-slate-800">
                <h2 className="text-xl font-bold">Create Order</h2>
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="text-3xl p-2 hover:bg-slate-800 rounded-full"
                >
                  ×
                </button>
              </div>

              {/* PANEL */}
              <div className="flex-1 min-h-0">
                <CreateOrderSidePanel
                  order={{
                    items: cartItems,
                    table_id: selectedTable,
                    table_no: selectedTableNumber,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default POS;
