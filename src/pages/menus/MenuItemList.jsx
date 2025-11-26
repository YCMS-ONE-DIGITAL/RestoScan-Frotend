// src/pages/MenuItemsList.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MenuItemsForm from "./MenuItemForm";

const getImageUrl = (path) => {
  if (!path) return null;

  if (path.startsWith("http")) return path;

  const base = "http://localhost:8000";

  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return base + path;
};

export default function MenuItemsList() {
  const qc = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // 🟢 Get logged-in restaurant
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-info"],
    queryFn: async () => {
      const res = await api.get("/restaurant/show");
      return res.data.restaurant;
    },
  });

  // 🟢 Fetch Menus
  const { data: menus = [] } = useQuery({
    queryKey: ["menus"],
    queryFn: () =>
      api.get("/restaurant/menus").then((r) => r?.data?.data || r?.data || []),
  });

  // 🟢 Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      api.get("/restaurant/categories").then((r) => r?.data || []),
  });

  // 🟢 Fetch Items (ALL + By Category)
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menuItems", selectedCategory],
    queryFn: async () => {
      let res;

      if (!selectedCategory) {
        // ⭐ Load ALL menu items
        res = await api.get("/restaurant/menu/item/list/all");
      } else {
        // ⭐ Load category-based items
        res = await api.get(
          `/restaurant/menu/item/list?category_id=${selectedCategory}`
        );
      }

      return res?.data?.data || res?.data || [];
    },
  });

  // 🟢 Delete Item
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/menu/item/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });

  const openForm = (item = null) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["menuItems"] });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        
        {/* CATEGORY SELECT */}
        <select
          className="bg-gray-900 border border-gray-700 px-5 py-3 rounded-lg text-lg w-full sm:w-auto"
          value={selectedCategory ?? ""}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value ? Number(e.target.value) : null
            )
          }
        >
          <option value="">All Items</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Button size="lg" onClick={() => openForm()}>
          + Add New Item
        </Button>
      </div>

      {/* ITEMS LIST */}
      {isLoading ? (
        <p className="text-center py-20 text-gray-400">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-center py-20 text-gray-400">
          No items found
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-all overflow-hidden"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start gap-3">
                  <span className="text-lg font-medium text-gray-300 truncate">
                    {item.name}
                  </span>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      item.type === "veg"
                        ? "bg-green-900 text-green-300"
                        : item.type === "non_veg"
                        ? "bg-red-900 text-red-300"
                        : "bg-yellow-900 text-yellow-300"
                    }`}
                  >
                    {item.type === "non_veg"
                      ? "Non-Veg"
                      : item.type.toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* IMAGE */}
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-56 object-cover rounded-lg bg-gray-800"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x300.png?text=No+Image")
                    }
                  />
                ) : (
                  <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg h-56 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-end">
                  <span className="text-3xl text-green-400 font-bold">₹{item.price}</span>
                  <span
                    className={`text-sm ${
                      item.is_available ? "text-green-400" : "text-red-500"
                    }`}
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openForm(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this item?")) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FORM MODAL */}
      {isFormOpen && restaurant && (
        <MenuItemsForm
          item={editItem}
          menus={menus}
          categories={categories}
          restaurantId={restaurant.id}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
