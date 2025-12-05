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

  const [showMobileCart, setShowMobileCart] = useState(false); // 🔥 FOR MOBILE DRAWER

  // GET RESTAURANT
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await api.get("/restaurant/show");
      return res.data.restaurant;
    },
  });

  // GET TABLES
  const { data: tables = [] } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await api.get(
        `/restaurant/table/list?restaurant_id=${restaurant.id}`
      );
      return res.data.data ?? [];
    },
    enabled: !!restaurant,
  });

  const handleSelectTable = (tableId) => {
    setSelectedTable(tableId);
    const tbl = tables.find((t) => t.id == tableId);
    setSelectedTableNumber(tbl?.table_no || "");
  };

  return (
    <div className="flex flex-col lg:flex-row dark:bg-gray-900 h-screen overflow-hidden">

      {/* LEFT SIDE (MENU) */}
      <div className="flex-1 p-4 overflow-y-auto pb-24 lg:pb-4">

        {/* TOP BAR */}
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

        <MenuGrid
          search={search}
          filterCat={filterCat}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      </div>

      {/* DESKTOP ORDER PANEL */}
      <div className="hidden lg:block lg:w-[380px] border-l border-gray-700">
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

      {/* MOBILE CART BUTTON */}
      <button
        onClick={() => setShowMobileCart(true)}
        className="lg:hidden fixed bottom-4 right-4 bg-green-600 text-white px-5 py-3 rounded-full shadow-xl z-50"
      >
        Cart ({cartItems.length})
      </button>

      {/* MOBILE CART DRAWER */}
      {showMobileCart && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50 flex justify-center">
          <div className="bg-gray-900 w-full max-h-[80%] mt-auto rounded-t-2xl p-4 overflow-y-auto">

            {/* Close button */}
            <button
              onClick={() => setShowMobileCart(false)}
              className="absolute right-5 top-3 text-white text-2xl"
            >
              ✕
            </button>

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
      )}
    </div>
  );
};

export default POS;
