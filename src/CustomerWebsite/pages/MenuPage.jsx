// MenuPage.jsx
import { useState } from "react";
import { Search, ShoppingCart, Pizza, Beef, Coffee, Cake, Drumstick } from "lucide-react";
import MenuItemCard from "../Components/MenuItemCard";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vegFilter, setVegFilter] = useState("all"); // All / veg / nonveg
  const [cart, setCart] = useState({});

  // IMAGE CATEGORIES
  const categories = [
  { id: "all", name: "All",img: "assets/customerwebsite/category/image.jpg"},
  { id: "pizza", name: "Pizza", img: "https://images.unsplash.com/photo-1601924582971-0302d2b7a9d4?auto=format&fit=crop&w=200&h=200" },
  { id: "burger", name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&h=200" },
  { id: "chicken", name: "Chicken", img: "https://images.unsplash.com/photo-1626645730804-0c07e1e4d93e?auto=format&fit=crop&w=200&h=200" },
  { id: "beverages", name: "Beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&h=200" },
  { id: "desserts", name: "Desserts", img: "https://images.unsplash.com/photo-1624353365286-3f8d1dede8c3?auto=format&fit=crop&w=200&h=200" },
];

  // MENU ITEMS
  const menuItems = [
    { id: 1, name: "Margherita Pizza", price: 249, img: "https://images.unsplash.com/photo-1601924582971-0302d2b7a9d4", type: "veg", category: "pizza", description: "Classic cheese pizza with fresh basil." },
    { id: 2, name: "Pepperoni Pizza", price: 349, img: "https://images.unsplash.com/photo-1628840042765-0a5c5a351139", type: "nonveg", category: "pizza", description: "Spicy pepperoni with extra cheese." },
    { id: 3, name: "Veg Burger", price: 199, img: "https://images.unsplash.com/photo-1550547660-d9450f859349", type: "veg", category: "burger", description: "Crispy veg patty with fresh veggies." },
    { id: 4, name: "Chicken Burger", price: 249, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", type: "nonveg", category: "burger", description: "Juicy chicken patty with mayo." },
    { id: 5, name: "Chicken Wings", price: 299, img: "https://images.unsplash.com/photo-1626645730804-0c07e1e4d93e", type: "nonveg", category: "chicken", description: "Spicy fried chicken wings." },
    { id: 6, name: "Cold Coffee", price: 149, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", type: "veg", category: "beverages", description: "Chilled creamy coffee with ice." },
    { id: 7, name: "Gulab Jamun", price: 99, img: "https://images.unsplash.com/photo-1624353365286-3f8d1dede8c3", type: "veg", category: "desserts", description: "Soft, sweet,sweet sweetsweetsweet sweetsweet soaked in sugar syrup." },
  ];

  // FILTER LOGIC
  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesVegFilter =
      vegFilter === "all" ||
      (vegFilter === "veg" && item.type === "veg") ||
      (vegFilter === "nonveg" && item.type === "nonveg");
    return matchesSearch && matchesCategory && matchesVegFilter;
  });

  const handleAdd = (item) => {
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const handleRemove = (item) => {
    setCart(prev => {
      const newQty = (prev[item.id] || 0) - 1;
      if (newQty <= 0) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: newQty };
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(i => i.id === parseInt(id));
    return sum + (item?.price || 0) * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* NORMAL HEADER */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
          <h1 className="font-bold text-gray-800">RestoScan</h1>
        </div>
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </div>
      </header>

      {/* STICKY: SEARCH + FILTER + CATEGORIES */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        {/* SEARCH + FILTER BUTTONS */}
        {/* SEARCH + FILTER BUTTONS - NO OVERFLOW */}
<div className="px-4 py-3 flex items-center gap-2">
  {/* SEARCH BAR - FLEXIBLE */}
  <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-0">
    <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
    <input
      type="text"
      placeholder="Search dishes..."
      className="bg-transparent flex-1 outline-none text-sm truncate"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* FILTER BUTTONS - SCROLLABLE IF NEEDED */}
  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide whitespace-nowrap flex-shrink-0">
    {/* ALL */}
    <button
      onClick={() => setVegFilter("all")}
      className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0
        ${vegFilter === "all"
          ? "bg-orange-500 text-white shadow-sm"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      All
    </button>

    {/* VEG */}
    <button
      onClick={() => setVegFilter("veg")}
      className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 flex items-center gap-1
        ${vegFilter === "veg"
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      <div className="w-3 h-3 rounded border-2 border-green-600 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
      </div>
      <span>Veg</span>
    </button>

    {/* NON-VEG */}
    <button
      onClick={() => setVegFilter("nonveg")}
      className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 flex items-center gap-1
        ${vegFilter === "nonveg"
          ? "bg-red-100 text-red-700 border border-red-300"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
    >
      <div className="w-3 h-3 rounded border-2 border-red-600 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
      </div>
      <span>Non-Veg</span>
    </button>
  </div>
</div>

        {/* CATEGORIES BAR - IMAGES */}
<div className="px-4 py-2">
  <div className="flex gap-3 overflow-x-auto scrollbar-hide whitespace-nowrap">
    
    {categories.map(cat => (
      
      <button
        key={cat.id}
        onClick={() => setSelectedCategory(cat.id)}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0
          ${selectedCategory === cat.id
            ? "bg-orange-100 text-orange-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        {/* IMAGE */}
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
          <img 
            src={cat.img} 
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* NAME */}
        <span className="text-xs font-medium">{cat.name}</span>
      </button>
    ))}
  </div>
</div>
      </div>

      {/* MENU LIST */}
      <div className="px-4 pt-3">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item, idx) => (
            <MenuItemCard
              key={item.id}
              item={item}
              index={idx + 1}
              onAdd={handleAdd}
              onRemove={handleRemove}
              quantity={cart[item.id] || 0}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8 text-sm">No items found</p>
        )}
      </div>

      {/* FOOTER */}
      <Footer cartCount={cartCount} total={total} />
    </div>
  );
}