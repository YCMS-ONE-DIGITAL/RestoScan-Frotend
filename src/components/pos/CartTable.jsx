import React from "react";

const CartTable = ({ cartItems, setCartItems }) => {
  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (id) => {
    setCartItems(
      cartItems.map((i) =>
        i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((i) => i.id !== id));
  };

  return (
    <div className="overflow-y-auto max-h-[350px]">
      <table className="w-full text-sm">
        <thead className="bg-gray-700 dark:bg-gray-700">
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-center">Qty</th>
            <th className="p-2 text-right">Amount</th>
            <th className="p-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800  dark:bg-gray-800">
          {cartItems.map((item) => (
            <tr key={item.id} className="border-b dark:border-gray-700">
              <td className="p-2">{item.name}</td>
              <td className="p-2 text-center">
                <button onClick={() => decreaseQty(item.id)} className="px-2 border">-</button>
                <span className="px-3">{item.qty}</span>
                <button onClick={() => increaseQty(item.id)} className="px-2 border">+</button>
              </td>
              <td className="p-2 text-right">₹{item.price * item.qty}</td>
              <td className="p-2 text-right">
                <button onClick={() => removeItem(item.id)} className="text-red-500">✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
