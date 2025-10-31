// MenuPage.jsx
import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import MenuItemCard from "../Components/MenuItemCard";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({}); // { id: quantity }

  const menuItems = [
    { id: 1, name: "Margherita Pizza", price: 249, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", type: "veg" },
    { id: 2, name: "Pasta Alfredo", price: 299, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", type: "veg" },
    { id: 3, name: "Veg Burger", price: 199, img: "https://images.unsplash.com/photo-1550547660-d9450f859349", type: "veg" },
    { id: 4, name: "Cold Coffee", price: 149, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", type: "veg", description: "Chilled creamy coffee with ice" },
  ];

  const filteredMenu = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
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

  // CORRECT COUNT & TOTAL
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(i => i.id === parseInt(id)); // menuItems use kar
    return sum + (item?.price || 0) * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <img
                        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
                        alt="Restaurant Logo"
                        className="w-8 h-8 rounded-full object-cover"
                    />
          <h1 className="text-lg font-bold text-gray-800">RestoScan</h1>
        </div>
        <div className="relative">
          <ShoppingCart size={24} className="text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search dishes..."
            className="bg-transparent w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 p-3 grid grid-cols-1 gap-3 overflow-y-auto">
        {filteredMenu.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAdd={handleAdd}
            onRemove={handleRemove}
            quantity={cart[item.id] || 0}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer cartCount={cartCount} total={total} orderType="DineIn" />
    </div>
  );
}