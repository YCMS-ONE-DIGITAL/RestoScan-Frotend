import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  // Load saved cart from localStorage on first render
  useEffect(() => {
    const savedCart = localStorage.getItem("cartData");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cart));
  }, [cart]);

  // ➕ Add to Cart
  const addToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: {
        item,
        quantity: (prev[item.id]?.quantity || 0) + 1,
        note: prev[item.id]?.note || "",
      },
    }));
  };


  
  // ➖ Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => {
      const entry = prev[id];
      if (!entry) return prev;

      if (entry.quantity <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [id]: { ...entry, quantity: entry.quantity - 1 },
      };
    });
  };

  // ✏️ Update note
  const updateNote = (id, note) => {
    setCart((prev) => ({
      ...prev,
      [id]: { ...prev[id], note },
    }));
  };

  // 🧹 Clear Cart
  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cartData");
  };

  // 🔢 Derived values
  const cartItems = Object.values(cart).map((entry) => ({
    ...entry.item,
    quantity: entry.quantity,
    note: entry.note,
  }));
  const cartCount = Object.values(cart).reduce(
    (sum, e) => sum + e.quantity,
    0
  );
  const total = Object.values(cart).reduce(
    (sum, e) => sum + e.item.price * e.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        total,
        addToCart,
        removeFromCart,
        updateNote,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
