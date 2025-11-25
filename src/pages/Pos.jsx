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

  const [selectedTable, setSelectedTable] = useState(""); // table ID
  const [selectedTableNumber, setSelectedTableNumber] = useState(""); // table_no

  // ✅ Get logged-in restaurant
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await api.get("/restaurant");
      return res.data.restaurant;
    },
  });

  // ✅ Fetch tables
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

  // ✅ Select table
  const handleSelectTable = (tableId) => {
    setSelectedTable(tableId);

    const tbl = tables.find((t) => t.id == tableId);
    setSelectedTableNumber(tbl?.table_no || "");
  };

  return (
    <div className="flex dark:bg-gray-900">

      {/* LEFT MENU SIDE */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-3">
          <MenuSearchBar search={search} setSearch={setSearch} />

          {/* ✅ Table Dropdown */}
          <select
            className="bg-gray-800 text-white px-3 py-2 rounded"
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

        <CategoryFilter setFilterCat={setFilterCat} />

        <MenuGrid
          search={search}
          filterCat={filterCat}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      </div>

      {/* ✅ ORDER PANEL */}
      <div className="w-[380px] border-l border-gray-700">
        <OrderSidePanel
          order={{
            items: cartItems,
            table_id: selectedTable,
            table_no: selectedTableNumber,
            orderNo: "New",
          }}
        />
      </div>
    </div>
  );
};

export default POS;
