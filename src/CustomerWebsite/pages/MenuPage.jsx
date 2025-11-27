import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import MenuItemCard from "../Components/MenuItemCard";
import Footer from "./Footer";
import { useCart } from "../context/CardContext";
import api from "@/api/api";
import { decryptData } from "@/utils/encryption";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vegFilter, setVegFilter] = useState("all");

  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState(""); // ✅ NEW
  const [tableNo, setTableNo] = useState(null);
  const [tableId, setTableId] = useState(null);

  const [categories, setCategories] = useState([
    { id: "all", name: "All", image: "/assets/customerwebsite/category/image.jpg" }
  ]);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, removeFromCart, updateNote, cartItems } = useCart();

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return base + (path.startsWith("/") ? path : "/" + path);
  };

  // ✅ Decode Token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const baseToken = params.get("token");

    if (!baseToken) {
      setLoading(false);
      return;
    }

    try {
      const decrypted = decryptData(atob(baseToken));

      if (decrypted?.restaurant_id) setRestaurantId(decrypted.restaurant_id);
      if (decrypted?.restaurant_name) setRestaurantName(decrypted.restaurant_name); // ✅ NEW

      if (decrypted?.table_no) setTableNo(decrypted.table_no);
      if (decrypted?.table_id) setTableId(decrypted.table_id);
    } catch {
      console.error("Invalid token");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch Categories
  useEffect(() => {
    if (!restaurantId) return;

    api
      .get(`/public/categories?restaurant_id=${restaurantId}`)
      .then((res) => {
        const formatted = res.data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          image: "/assets/customerwebsite/category/image.jpg",
        }));

        setCategories([
          { id: "all", name: "All", image: "/assets/customerwebsite/category/image.jpg" },
          ...formatted,
        ]);
      })
      .catch((err) => console.log("CATEGORY ERROR =", err.response?.data));
  }, [restaurantId]);

  // ✅ Fetch Menu Items
  useEffect(() => {
    if (!restaurantId) return;

    api
      .get(`/public/menu/items?restaurant_id=${restaurantId}`)
      .then((res) => {
        const raw = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        const items = raw.map((item) => ({
          id: item.id,
          name: item.item_name ?? item.name ?? "",
          price: item.item_price ?? item.price ?? 0,
          img: getImageUrl(item.item_image ?? item.image),
          type: item.item_type ?? item.type ?? "",
          category: item.category_id,
          description: item.description ?? "",
        }));

        setMenuItems(items);
      })
      .catch((err) => console.log("MENU API ERROR =", err.response?.data))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  // ✅ Filtering Logic
  const filteredMenu = menuItems.filter((item) => {
    const matchSearch =
      (item.name || "").toLowerCase().includes(search.toLowerCase());

    const matchCat =
      selectedCategory === "all" ||
      item.category === selectedCategory;

    const matchVeg =
      vegFilter === "all" ||
      (vegFilter === "veg" && item.type === "veg") ||
      (vegFilter === "non_veg" && item.type === "non_veg");

    return matchSearch && matchCat && matchVeg;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
        Loading menu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ✅ HEADER */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-gray-800">{restaurantName || "RestoScan"}</h1>

        {tableNo ? (
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
            <Users size={16} />
            Table {tableNo}
          </div>
        ) : (
          <span className="text-xs text-gray-400">Online Ordering</span>
        )}
      </header>

      {/* SEARCH + VEG FILTER */}
      <div className="sticky top-0 bg-white px-4 py-3 border-b space-y-3 z-20">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search dishes..."
            className="flex-1 bg-transparent outline-none ml-3 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setVegFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
              ${vegFilter === "all"
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            All
          </button>

          <button
            onClick={() => setVegFilter("veg")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
              ${vegFilter === "veg"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            Veg
          </button>

          <button
            onClick={() => setVegFilter("non_veg")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
              ${vegFilter === "non_veg"
                ? "bg-red-100 text-red-700 border border-red-400"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            Non-Veg
          </button>
        </div>
      </div>

      {/* CATEGORY SLIDER */}
      <div className="px-4 py-2">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg flex-shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-orange-100 text-orange-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MENU LIST */}
      <div className="px-4 py-3">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => {
            const existing = cartItems.find((c) => c.id === item.id);
            const qty = existing ? existing.quantity : 0;

            return (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={qty}
                onAdd={() => addToCart(item)}
                onRemove={() => removeFromCart(item.id)}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-10">
            No menu items found
          </p>
        )}
      </div>

      {/* ✅ FOOTER */}
      <Footer
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        tableNo={tableNo}
        tableId={tableId}
      />
    </div>
  );
}
