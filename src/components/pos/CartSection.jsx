import React, { useState } from "react";
import CartTable from "./CartTable";

const CartSection = ({ cartItems, setCartItems }) => {
  const [orderType, setOrderType] = useState("dine_in");
  const [noOfPax, setNoOfPax] = useState(1);

  // Calculate totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="bg-gray-800 w-1/2  flex-grow p-4 ">

      {/* ✅ Order Type Selection */}
      <div className="flex justify-between bg-gray-800 mb-3">
        <div className="flex gap-4">
          {["dine_in", "delivery", "pickup"].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="mr-2"
                checked={orderType === type}
                onChange={() => setOrderType(type)}
              />
              <span className="text-gray-300 capitalize">
                {type.replace("_", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* ✅ Conditional: Show "Assign Table" if Dine In, else show Pax Input */}
      <div className="flex justify-between bg-gray-800 items-center mb-4">
        {orderType === "dine_in" ? (
          <button
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => console.log("Assign Table Modal Open")}
          >
            Assign Table
          </button>
        ) : (
          <div className="flex items-center text-sm text-gray-300">
            Pax:
            <input
              type="number"
              min="1"
              value={noOfPax}
              onChange={(e) => setNoOfPax(e.target.value)}
              className="ml-2 w-16 px-2 py-1 border rounded bg-gray-800 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* ✅ Cart Items Table */}
      <CartTable cartItems={cartItems} setCartItems={setCartItems} />

      {/* ✅ Summary Section */}
      <div className="mt-4 bg-gray-800 dark:bg-gray-700 rounded p-4 space-y-2">
        <div className="flex justify-between text-gray-300">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>₹{subTotal}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-200">
          <span>Total</span>
          <span>₹{subTotal}</span>
        </div>
      </div>

      {/* ✅ KOT & BILL Buttons */}
      <div className="mt-4 flex gap-2">
        <button className="w-full bg-gray-700 text-white py-2 rounded">KOT</button>
        <button className="w-full bg-green-600 text-white py-2 rounded">BILL</button>
      </div>
    </div>
  );
};

export default CartSection;
