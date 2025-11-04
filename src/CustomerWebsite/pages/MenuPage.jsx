// src/CustomerWebsite/pages/MenuPage.jsx
import { useState } from "react";
import { Search, ShoppingCart, Pizza, Beef, Coffee, Cake, Drumstick } from "lucide-react";
import MenuItemCard from "../Components/MenuItemCard";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function MenuPage() {
 const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vegFilter, setVegFilter] = useState("all");
  
  // cart: { id: { item, quantity, note } }
  const [cart, setCart] = useState({});

  const categories = [
    { id: "all", name: "All", img: "assets/customerwebsite/category/image.jpg" },
    { id: "pizza", name: "Pizza", img: "https://images.unsplash.com/photo-1601924582971-0302d2b7a9d4?auto=format&fit=crop&w=200&h=200" },
    { id: "burger", name: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&h=200" },
    { id: "chicken", name: "Chicken", img: "https://images.unsplash.com/photo-1626645730804-0c07e1e4d93e?auto=format&fit=crop&w=200&h=200" },
    { id: "beverages", name: "Beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&h=200" },
    { id: "desserts", name: "Desserts", img: "https://images.unsplash.com/photo-1624353365286-3f8d1dede8c3?auto=format&fit=crop&w=200&h=200" },
  ];

  const menuItems = [
    { id: 1, name: "Margherita Pizza", price: 249, img: "https://images.unsplash.com/photo-1601924582971-0302d2b7a9d4", type: "veg", category: "pizza", description:"hello hello Deliciously cooked with premium ingredients. Deliciously cooked with premium ingredients.Deliciously cooked with premium ingredients. Deliciously cooked with premium ingredients."},
    { id: 2, name: "Pepperoni Pizza", price: 349, img: "https://images.unsplash.com/photo-1628840042765-0a5c5a351139", type: "nonveg", category: "pizza" },
    { id: 3, name: "Veg Burger", price: 199, img: "https://images.unsplash.com/photo-1550547660-d9450f859349", type: "veg", category: "burger" },
    { id: 4, name: "Chicken Burger", price: 249, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", type: "nonveg", category: "burger" },
    { id: 5, name: "Chicken Wings", price: 299, img: "https://images.unsplash.com/photo-1626645730804-0c07e1e4d93e", type: "nonveg", category: "chicken" },
    { id: 6, name: "Cold Coffee", price: 149, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", type: "veg", category: "beverages" },
    { id: 7, name: "Gulab Jamun", price: 99, img: "https://images.unsplash.com/photo-1624353365286-3f8d1dede8c3", type: "veg", category: "desserts" },
  ];

  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesVegFilter =
      vegFilter === "all" ||
      (vegFilter === "veg" && item.type === "veg") ||
      (vegFilter === "nonveg" && item.type === "nonveg");
    return matchesSearch && matchesCategory && matchesVegFilter;
  });

  // ADD TO CART
  const handleAdd = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        item,
        quantity: (prev[item.id]?.quantity || 0) + 1,
        note: prev[item.id]?.note || ""
      }
    }));
  };

  // REMOVE FROM CART
  const handleRemove = (id) => {
    setCart(prev => {
      const entry = prev[id];
      if (!entry) return prev;
      if (entry.quantity <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...entry, quantity: entry.quantity - 1 } };
    });
  };

  // UPDATE NOTE
  const updateNote = (id, note) => {
    setCart(prev => ({
      ...prev,
      [id]: { ...prev[id], note }
    }));
  };

  // CALCULATE
  const cartCount = Object.values(cart).reduce((sum, e) => sum + e.quantity, 0);
  const total = Object.values(cart).reduce((sum, e) => sum + e.item.price * e.quantity, 0);

  // CART ITEMS ARRAY
  const cartItems = Object.values(cart).map(entry => ({
    ...entry.item,
    quantity: entry.quantity,
    note: entry.note
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
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

      {/* SEARCH + FILTERS */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center gap-2">
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

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide whitespace-nowrap flex-shrink-0">
            <button
              onClick={() => setVegFilter("all")}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0
                ${vegFilter === "all" ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter("veg")}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 flex items-center gap-1
                ${vegFilter === "veg" ? "bg-green-100 text-green-700 border border-green-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <div className="w-3 h-3 rounded border-2 border-green-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              </div>
              <span>Veg</span>
            </button>
            <button
              onClick={() => setVegFilter("nonveg")}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 flex items-center gap-1
                ${vegFilter === "nonveg" ? "bg-red-100 text-red-700 border border-red-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              <div className="w-3 h-3 rounded border-2 border-red-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              </div>
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="px-4 py-2">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide whitespace-nowrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0
                  ${selectedCategory === cat.id ? "bg-orange-100 text-orange-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                </div>
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
            onAdd={handleAdd}
            onRemove={() => handleRemove(item.id)}
            quantity={cart[item.id]?.quantity || 0}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8 text-sm">No items found</p>
        )}
      </div>

      {/* FOOTER WITH CART MODAL */}
      <Footer 
       cartItems={cartItems}
        cartCount={cartCount}
        total={total}
        onUpdateQuantity={handleRemove}   // - बटण
        onAddQuantity={handleAdd}         // + बटण
        onUpdateNote={updateNote}
      />
    </div>
  );
}