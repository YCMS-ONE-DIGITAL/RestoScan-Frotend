import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export default function MenuGrid({ search, filterCat, cartItems, setCartItems }) {

  // Fetch ALL items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["allMenuItems"],
    queryFn: async () => {
      const res = await api.get("/restaurant/menu/item/list/all");
      return res.data.data ?? [];
    },
  });

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (!items.length) return <p className="text-white">No items found.</p>;

  // 🔥 SAFE FILTERING → avoids "filter is not a function"
  const filtered = Array.isArray(items) ? items : [];

  // Search apply
  let result = filtered.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  // Category filter apply
  if (filterCat) {
    result = result.filter((i) => i.category_id === filterCat);
  }

  // Add item to cart
  const addToCart = (item) => {
  const exists = cartItems.find((c) => c.id === item.id);

  if (exists) {
    setCartItems(
      cartItems.map((c) =>
        c.id === item.id
          ? { ...c, qty: Number(c.qty) + 1 }
          : c
      )
    );
  } else {
    setCartItems([
      ...cartItems,
      {
        ...item,
        price: Number(item.price),
        qty: 1,
      },
    ]);
  }
};


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
      {result.map((item) => (
        <div
          key={item.id}
          className="p-3 bg-gray-800 rounded-lg cursor-pointer"
          onClick={() => addToCart(item)}
        >
          {item.image && (
            <img
              src={item.image}
              className="h-24 w-full object-cover rounded mb-2"
            />
          )}

          <h3 className="text-white font-semibold">{item.name}</h3>
          <p className="text-gray-300 text-sm">{item.type}</p>
          <p className="text-green-400 font-bold mt-1">₹{item.price}</p>
        </div>
      ))}
    </div>
  );
}
