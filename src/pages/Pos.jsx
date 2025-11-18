import React, { useState } from "react";
import MenuSearchBar from "../components/pos/MenuSearchBar";
import CategoryFilter from "../components/pos/CategoryFilter";
import MenuGrid from "../components/pos/MenuGrid";
import OrderSidePanel from "../components/pos/OrderSidePanel";

const POS = () => {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  return (
    <div className="flex dark:bg-gray-900 min-h-screen">

      {/* LEFT SIDE */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-3">
          <MenuSearchBar search={search} setSearch={setSearch} />

          {/* Table Selector */}
          <select
            className="bg-gray-800 text-white px-3 py-2 rounded"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">Select Table</option>
            <option value="1">Table 1</option>
            <option value="2">Table 2</option>
            <option value="3">Table 3</option>
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

      {/* RIGHT FIXED PANEL ALWAYS OPEN */}
      <div className="w-[380px] border-l border-gray-700">
        <OrderSidePanel
          order={{
            items: cartItems,
            table_id: selectedTable,
            orderNo: "New",
          }}
        />
      </div>

    </div>
  );
};

export default POS;
