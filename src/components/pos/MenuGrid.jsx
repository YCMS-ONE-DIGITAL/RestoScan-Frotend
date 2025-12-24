// MenuGrid.jsx
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { getImageUrl } from "../../utils/image";

export default function MenuGrid({
  search,
  filterCat,
  cartItems,
  setCartItems,
}) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["allMenuItems"],
    queryFn: async () => {
      const res = await api.get("/restaurant/menu/item/list/all");
      return res.data.data ?? [];
    },
  });

  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-400">
        Loading menu...
      </p>
    );
  }

  if (!items.length) {
    return (
      <p className="text-center py-10 text-gray-400">
        No items found.
      </p>
    );
  }

  const result = items
    .filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((i) => !filterCat || i.category_id === filterCat);

  const addToCart = (item) => {
    if (!item.is_available) return;

    const exists = cartItems.find((c) => c.id === item.id);

    if (exists) {
      setCartItems(
        cartItems.map((c) =>
          c.id === item.id
            ? { ...c, qty: c.qty + 1 }
            : c
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  return (
    <div
      className="
        grid gap-4
        [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]
      "
    >
      {result.map((item) => (
        <div
          key={item.id}
          onClick={() => addToCart(item)}
          className={`
            group relative
            bg-gray-800 rounded-xl
            transition-all duration-200
            active:scale-[0.97]
            hover:shadow-xl
            ${
              item.is_available
                ? "cursor-pointer hover:ring-1 hover:ring-green-500/40"
                : "cursor-not-allowed opacity-60"
            }
          `}
        >
          {/* IMAGE */}
          <div className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden rounded-t-xl">
            {item.image ? (
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  No Image
                </span>
              </div>
            )}

            {!item.is_available && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-sm font-bold">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-3 flex flex-col gap-2">
            {/* TITLE + TYPE */}
            <div className="flex items-start gap-2">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1">
                {item.name}
              </h3>

              <span
                className={`
                  shrink-0 px-2 py-0.5
                  text-[10px] font-bold rounded border
                  ${
                    item.type === "veg"
                      ? "text-green-500 bg-green-500/10 border-green-500"
                      : "text-red-500 bg-red-500/10 border-red-500"
                  }
                `}
              >
                {item.type === "veg" ? "VEG" : "NON-VEG"}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-xs line-clamp-2">
              {item.description || "Delicious dish"}
            </p>

            {/* PRICE + AVAILABILITY */}
            <div className="flex flex-row justify-between mt-1">
              <span className="text-green-400 font-bold text-base">
                ₹{item.price}
              </span>

              <span
                className={`
                  inline-flex items-center gap-1
                  w-fit px-2 py-0.5
                  text-[10px] font-semibold rounded-full
                  ${
                    item.is_available
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                `}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.is_available
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                />
                {item.is_available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          {/* TAP FEEDBACK */}
          <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition bg-green-500/10 pointer-events-none rounded-xl" />
        </div>
      ))}
    </div>
  );
}
