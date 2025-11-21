import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export default function MenuGrid({ search, filterCat, cartItems, setCartItems }) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["allMenuItems"],
    queryFn: async () => {
      const res = await api.get("/restaurant/menu/item/list/all");
      console.log(res.data.data)
      return res.data.data ?? [];

    },
  });

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const base = "http://localhost:8000";
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  if (isLoading) return <p className="text-white text-center py-10">Loading menu...</p>;
  if (!items.length) return <p className="text-white text-center py-10">No items found.</p>;

  // Filtering
  let result = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filterCat) {
    result = result.filter((i) => i.category_id === filterCat);
  }

  const addToCart = (item) => {
    if (!item.is_available) return;

    const exists = cartItems.find((c) => c.id === item.id);
    if (exists) {
      setCartItems(
        cartItems.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-6">
      {result.map((item) => (
        <div
          key={item.id}
          onClick={() => addToCart(item)}
          className={`relative group overflow-hidden bg-gray-800 rounded-xl transition-all duration-300
            ${item.is_available 
              ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-1 hover:bg-gray-750' 
              : 'cursor-not-allowed opacity-60'
            }`}
        >
          

          {/* Image */}
          {item.image ? (
            <div className="relative h-40 bg-gray-900 rounded-t-xl overflow-hidden">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {!item.is_available && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg"></span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-40 bg-gray-700 border-2 border-dashed border-gray-600 rounded-t-xl flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold text-lg line-clamp-2 flex-1 pr-2">
                {item.name}
              </h3>
              <div className="flex items-center gap-2">

      {/* VEG / NON-VEG Badge */}
      <div
        className={`flex items-center px-2.5 py-1 text-xs font-bold rounded border whitespace-nowrap
          ${item.type=="veg"
            ? 'text-green-500 bg-green-500/10 border-green-500'
            : 'text-red-500 bg-red-500/10 border-red-500'
          }`}
      >
        {item.type =="veg" ? 'VEG' : 'NON-VEG'}
      </div>
    </div>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-3 min-h-10">
              {item.description || "A delicious dish crafted with love"}
            </p>

            <div className="flex justify-between items-center">
              <p className="text-green-400 font-bold text-xl">₹{item.price}</p>

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium
                  ${item.is_available
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-red-500/15 text-red-400'
                  }`}
              >
                {item.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>
      ))}

      
    </div>
  );
}