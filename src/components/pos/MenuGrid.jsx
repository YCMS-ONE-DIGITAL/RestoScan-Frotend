import React from "react";
import { menuItems } from "./data";

const MenuGrid = ({ search, filterCat, cartItems, setCartItems }) => {
  const filteredItems = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCat ? item.category === filterCat : true;
    return matchSearch && matchCategory;
  });

  const addToCart = (item) => {
    const exists = cartItems.find((i) => i.id === item.id);
    if (exists) {
      setCartItems(
        cartItems.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
      {filteredItems.map((item) => (
        <li key={item.id} onClick={() => addToCart(item)}>
          <div className="bg-gray-800 dark:bg-gray-800 p-3 rounded-lg shadow cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-700">
            <img src={item.image} className="h-16 w-16 object-cover mx-auto" />
            <h3 className="text-sm font-medium text-center mt-2 dark:text-gray-200">
              {item.name}
            </h3>
            <p className="text-center text-gray-300 dark:text-gray-300">
              ₹{item.price}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MenuGrid;
