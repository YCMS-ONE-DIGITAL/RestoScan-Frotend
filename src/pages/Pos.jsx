import React, { useState } from "react";
import MenuSearchBar from "../components/pos/MenuSearchBar";
import CategoryFilter from "../components/pos/CategoryFilter";
import MenuGrid from "../components/pos/MenuGrid";
import CartSection from "../components/pos/CartSection";

const POS = () => {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  return (
    <div className="flex-grow lg:flex   dark:bg-gray-900 min-h-screen">
      {/* Left Section */}
      <div className="flex flex-col  px-2 w-full">
        <MenuSearchBar search={search} setSearch={setSearch} />
        <CategoryFilter setFilterCat={setFilterCat} />

        <MenuGrid
          search={search}
          filterCat={filterCat}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      </div>

      {/* Right Section */}
      <CartSection cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default POS;
