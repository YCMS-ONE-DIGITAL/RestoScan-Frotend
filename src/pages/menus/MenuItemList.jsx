import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MenuItemsForm from "./MenuItemForm";

export default function MenuItemsList() {
  const qc = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ⭐ SAFE FETCH MENUS
  const { data: menus = [] } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await api.get("/restaurant/menus");

      return (
        res?.data?.data ||     // { data: [...] }
        res?.data ||           // [...]
        []                     // default
      );
    },
  });

  // ⭐ SAFE FETCH CATEGORIES
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/restaurant/categories");

      return (
        res?.data?.data || 
        res?.data || 
        []
      );
    },
  });

  // ⭐ SAFE FETCH ITEMS
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menuItems", selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      const res = await api.get(
        `/restaurant/menu/item/list?category_id=${selectedCategory}`
      );

      return (
        res?.data?.data ||
        res?.data ||
        []
      );
    },
    enabled: !!selectedCategory,
  });

  // ⭐ Delete item
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/menu/item/${id}`),
    onSuccess: () => qc.invalidateQueries(["menuItems", selectedCategory]),
  });

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <select
          className="bg-gray-900 text-white px-3 py-2 rounded border border-gray-700"
          value={selectedCategory ?? ""}
          onChange={(e) =>
            setSelectedCategory(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Select Category</option>

          {(categories || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <Button
          onClick={() => {
            setEditItem(null);
            setIsFormOpen(true);
          }}
        >
          + Add Item
        </Button>
      </div>

      {/* ITEMS LIST */}
      {isLoading ? (
        <p>Loading...</p>
      ) : !selectedCategory ? (
        <p>Select a category to view items.</p>
      ) : items.length === 0 ? (
        <p>No items in this category.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{it.name}</span>
                  <span className="text-sm">{it.type}</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}

                <p className="text-sm">{it.description}</p>
                <p className="font-semibold mt-2">₹{it.price}</p>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditItem(it);
                      setIsFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(it.id)}
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
      {isFormOpen && (
        <MenuItemsForm
          item={editItem}
          categories={categories || []}
          menus={menus || []}
          onClose={() => {
            setIsFormOpen(false);
            setEditItem(null);
            qc.invalidateQueries(["menuItems", selectedCategory]);
          }}
        />
      )}
    </div>
  );
}
