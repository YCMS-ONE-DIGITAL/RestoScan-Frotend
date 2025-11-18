import { useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";

export default function CartSection({ cartItems, setCartItems, selectedTable }) {
  const placeOrderMutation = useMutation({
    mutationFn: async (payload) => {
      return api.post("/restaurant/orders/create", payload);
    },
    onSuccess: (res) => {
      alert("Order Created! Order ID: " + res.data.order.id);
      setCartItems([]);
    },
    onError: (err) => alert("Order failed"),
  });

  const handlePlaceOrder = () => {
    if (!selectedTable) {
      return alert("Please select a table first!");
    }

    if (cartItems.length === 0) {
      return alert("Cart is empty!");
    }

    const payload = {
      table_id: selectedTable,
      items: cartItems.map((i) => ({
        menu_item_id: i.id,
        quantity: i.quantity,
      })),
    };

    placeOrderMutation.mutate(payload);
  };
// increase qty
const increaseQty = (id) => {
  setCartItems(cartItems.map(item =>
    item.id === id
      ? { ...item, qty: Number(item.qty) + 1 }
      : item
  ));
};

// decrease qty (never below 1)
const decreaseQty = (id) => {
  setCartItems(cartItems.map(item =>
    item.id === id
      ? { ...item, qty: Math.max(1, Number(item.qty) - 1) }
      : item
  ));
};

// remove item
const removeItem = (id) => {
  setCartItems(cartItems.filter(item => item.id !== id));
};

// total
const total = cartItems.reduce(
  (sum, item) => sum + Number(item.price) * Number(item.qty),
  0
);


  return (
    <div className="w-full lg:w-1/3 bg-gray-800 p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Cart</h2>

      {cartItems.map((item) => (
  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-800 rounded mb-2">
    <div>
      <p className="text-white text-sm">{item.name}</p>
      <p className="text-gray-400 text-xs">₹{item.price}</p>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={() => decreaseQty(item.id)}
        className="bg-gray-700 text-white px-2 rounded"
      >
        -
      </button>

      <span className="text-white w-6 text-center">
        {Number(item.qty)}
      </span>

      <button
        onClick={() => increaseQty(item.id)}
        className="bg-gray-700 text-white px-2 rounded"
      >
        +
      </button>
    </div>

    <button
      onClick={() => removeItem(item.id)}
      className="text-red-400 text-sm"
    >
      ✕
    </button>
  </div>
))}


      <hr className="my-3" />

      <p className="font-semibold text-lg mb-3">Total: ₹{total}</p>

      <Button
        className="w-full bg-green-600"
        onClick={handlePlaceOrder}
        disabled={placeOrderMutation.isPending}
      >
        {placeOrderMutation.isPending ? "Placing..." : "Place Order"}
      </Button>
    </div>
  );
}
