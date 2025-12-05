// src/pages/MenuItemsList.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MenuItemsForm from "./MenuItemForm";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmBox from "../../components/ConfirmBox";

const getImageUrl = (path) => {
  if (!path) return null;

  // Full URL
  if (path.startsWith("http")) return path;

  // Laravel public storage
  return "http://localhost:8000/storage/" + path;
};


export default function MenuItemsList() {
  const qc = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ⭐ Get restaurant info
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant-info"],
    queryFn: async () => {
      const res = await api.get("/restaurant/show");
      return res.data.restaurant;
    },
  });

  // ⭐ Get menus
  const { data: menus = [] } = useQuery({
    queryKey: ["menus"],
    queryFn: () =>
      api.get("/restaurant/menus").then((r) => r?.data?.data || r?.data || []),
  });

  // ⭐ Get categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/restaurant/categories").then((r) => r?.data || []),
  });

  // ⭐ Get Items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menuItems", selectedCategory],
    queryFn: async () => {
      let res;

      if (!selectedCategory) {
        res = await api.get("/restaurant/menu/item/list/all");
      } else {
        res = await api.get(`/restaurant/menu/item/list`, {
          params: { category_id: selectedCategory },
        });
      }

      return res?.data?.data || res?.data || [];
    },
  });

  // ⭐ DELETE MUTATION WITH TOAST
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/menu/item/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item deleted successfully!");   // ⭐ SUCCESS TOAST
    },
    onError: () => {
      toast.error("Failed to delete item!");          // ⭐ ERROR TOAST
    },
  });

  const openForm = (item = null) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditItem(null);
    qc.invalidateQueries({ queryKey: ["menuItems"] });
    // toast.success("Item saved successfully!");       // ⭐ FORM SAVE TOAST
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card
      key={item.id}
      className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-all overflow-hidden"
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start gap-2">
          <span className="text-base font-medium text-gray-300 truncate">
            {item.name}
          </span>

          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              item.type === "veg"
                ? "bg-green-900 text-green-300"
                : item.type === "non_veg"
                ? "bg-red-900 text-red-300"
                : "bg-yellow-900 text-yellow-300"
            }`}
          >
            {item.type === "non_veg" ? "Non-Veg" : item.type.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 p-3">

        {/* ⭐ COMPACT IMAGE */}
        {item.image ? (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-36 object-cover rounded-md bg-gray-800"
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/400x300.png?text=No+Image")
            }
          />
        ) : (
          <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-md h-36 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}

        {/* ⭐ DESCRIPTION */}
        <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>

        {/* ⭐ SIZE BADGE */}
        {item.size && (
          <span className="inline-block bg-blue-900 text-blue-300 px-2 py-0.5 rounded text-[10px] font-semibold">
            {item.size.toUpperCase()}
          </span>
        )}

        {/* ⭐ PRICE + AVAILABILITY */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-xl text-green-400 font-bold">
            ₹{item.price}
          </span>

          <span
            className={`text-xs ${
              item.is_available ? "text-green-400" : "text-red-500"
            }`}
          >
            {item.is_available ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* ⭐ ACTION BUTTONS */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs"
            onClick={() => openForm(item)}
          >
            Edit
          </Button>

         <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDeleteId(item.id);
                      setConfirmOpen(true);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
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
       <ConfirmBox
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              title="Delete Menu?"
              message={
                deleteId
                  ? `Are you sure you want to delete "${items.find(m => m.id === deleteId)?.name || ""}"?`
                  : ""
              }
              onConfirm={() => {
                deleteMutation.mutate(deleteId);
                setConfirmOpen(false);
              }}
            />
          
    </div>
  );
}
