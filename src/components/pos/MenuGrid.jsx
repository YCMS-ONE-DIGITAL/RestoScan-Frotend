// MenuGrid.jsx
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { getImageUrl } from "../../utils/image";

export default function MenuGrid({ search, filterCat, cartItems, setCartItems }) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["allMenuItems"],
    queryFn: async () => {
      const res = await api.get("/restaurant/menu/item/list/all");
      return res.data.data ?? [];
    },
  });



  if (isLoading) return <p className="text-center py-10 text-gray-400">Loading menu...</p>;
  if (!items.length) return <p className="text-center py-10 text-gray-400">No items found.</p>;

  let result = items
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => !filterCat || i.category_id === filterCat);

  const addToCart = (item) => {
    if (!item.is_available) return;

    const exists = cartItems.find((c) => c.id === item.id);
    if (exists) {
      setCartItems(cartItems.map((c) =>
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {result.map((item) => (
        <div
          key={item.id}
          onClick={() => addToCart(item)}
          className={`group relative bg-gray-800 rounded-xl overflow-hidden transition-all duration-300
            ${item.is_available
              ? "cursor-pointer hover:shadow-2xl hover:scale-105"
              : "cursor-not-allowed opacity-60"
            }`}
        >
          {/* Image */}
          {item.image ? (
            <div className="aspect-square relative overflow-hidden bg-gray-900">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {!item.is_available && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-xl font-bold">Sold Out</span>
                </div>
              )}
            </div>
          ) : (
  <div className="aspect-square bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}

          {/* Content */}
          <div className="p-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm line-clamp-2 flex-1 pr-2">
                {item.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-bold rounded border
                  ${item.type === "veg"
                    ? "text-green-500 bg-green-500/10 border-green-500"
                    : "text-red-500 bg-red-500/10 border-red-500"
                  }`}
              >
                {item.type === "veg" ? "VEG" : "NON-VEG"}
              </span>
            </div>

            <p className="text-gray-400 text-xs line-clamp-2 mb-3">
              {item.description || "Delicious dish"}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-green-400 font-bold text-lg">₹{item.price}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full
                  ${item.is_available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                `}
              >
                {item.is_available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}