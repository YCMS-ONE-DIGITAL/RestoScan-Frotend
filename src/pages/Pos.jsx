import React, { useState } from "react";
import MenuSearchBar from "../components/pos/MenuSearchBar";
import CategoryFilter from "../components/pos/CategoryFilter";
import MenuGrid from "../components/pos/MenuGrid";
import OrderSidePanel from "../components/pos/OrderSidePanel";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

const POS = () => {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const [selectedTable, setSelectedTable] = useState("");
  const [selectedTableNumber, setSelectedTableNumber] = useState("");

  const [showMobileCart, setShowMobileCart] = useState(false);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await api.get("/restaurant/show");
      return res.data.restaurant;
    },
  });

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
      {/* Overlay when mobile cart open */}
      {showMobileCart && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setShowMobileCart(false)}
        />
      )}

      <div className="flex h-screen  text-white overflow-hidden">
        {/* LEFT MENU AREA - Takes remaining space */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 p-4  border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <MenuSearchBar search={search} setSearch={setSearch} />

              <select
                className="bg-gray-800 text-white px-3 py-2 rounded w-full sm:w-auto"
                value={selectedTable}
                onChange={(e) => handleSelectTable(e.target.value)}
              >
                <option value="">Select Table</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.table_no} — {t.seating_number} Seats
                  </option>
                ))}
              </select>
            </div>

            <CategoryFilter filterCat={filterCat} setFilterCat={setFilterCat} />
          </div>

          {/* Menu Grid - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 pb-20">
            <MenuGrid
              search={search}
              filterCat={filterCat}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          </div>
        </div>

        {/* RIGHT ORDER PANEL - Desktop Only, Fixed Width */}
        <div className="hidden lg:block w-96 flex-shrink-0 border-l border-gray-700">
          <OrderSidePanel
            order={{
              id: null,
              items: cartItems,
              table_id: selectedTable,
              table_no: selectedTableNumber,
              customer: null,
              order_type: "dine_in",
              status: "pending",
              payment_status: "pending",
              payment_method: "",
            }}
          />
        </div>

        {/* MOBILE FLOATING CART BUTTON */}
        <button
          onClick={() => setShowMobileCart(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full shadow-2xl z-50 flex items-center gap-3 text-lg font-semibold transition-shadow"
        >
          <span>Cart</span>
          <span className="bg-green-700 px-3 py-1 rounded-full text-sm">
            {cartItems.length}
          </span>
        </button>

        {/* MOBILE CART DRAWER */}
        {showMobileCart && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50">
            <div className="bg-gray-800 rounded-t-3xl shadow-2xl h-[85vh] flex flex-col">
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-xl font-bold">Your Order</h2>
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="text-3xl p-2 hover:bg-gray-700 rounded-full transition"
                >
                  ×
                </button>
              </div>

              {/* Order Panel - Takes full height & scrolls internally */}
              <div className="flex-1 overflow-y-auto">
                <OrderSidePanel
                  order={{
                    id: null,
                    items: cartItems,
                    table_id: selectedTable,
                    table_no: selectedTableNumber,
                    customer: null,
                    order_type: "dine_in",
                    status: "pending",
                    payment_status: "pending",
                    payment_method: "",
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