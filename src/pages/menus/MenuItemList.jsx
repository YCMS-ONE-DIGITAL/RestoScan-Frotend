// src/pages/menus/MenuItemsList.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MenuItemsForm from "./MenuItemForm";

export default function MenuItemsList() {
  const qc = useQueryClient();
  const [filterMenuId, setFilterMenuId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ✅ Fetch menus for dropdown (new v5 syntax)
  const { data: menus = [] } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await api.get("/menus");
      return Array.isArray(res.data) ? res.data : res.data.menus || [];
    },
  });

  // ✅ Fetch categories for dropdown (new v5 syntax)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return Array.isArray(res.data) ? res.data : res.data.categories || [];
    },
  });

  // ✅ Fetch items for selected menu; if none selected, fetch all items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menuItems", filterMenuId ?? "all"],
    queryFn: async () => {
      if (filterMenuId) {
        const res = await api.get(`/menus/${filterMenuId}/items`);
        return Array.isArray(res.data) ? res.data : res.data.items || [];
      } else {
        // fallback: fetch all items across menus if route not available
        const all = [];
        for (const m of menus) {
          const r = await api.get(`/menus/${m.id}/items`);
          const arr = Array.isArray(r.data) ? r.data : r.data.items || [];
          all.push(...arr.map(it => ({ ...it, menu: m.name })));
        }
        return all;
      }
    },
    enabled: menus.length > 0, // ensure menus query runs first
  });

  // ✅ Delete mutation (v5 syntax)
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems", filterMenuId ?? "all"] }),
  });


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm">Filter menu:</label>
          <select
            value={filterMenuId ?? ""}
            onChange={(e) => setFilterMenuId(e.target.value ? Number(e.target.value) : null)}
            className="bg-[#0E1421] border border-gray-700 text-white px-3 py-2 rounded"
          >
            <option value="">All menus</option>
            {menus.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
          >
            + Add Item
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{it.name}</span>
                  <span className="text-sm">{it.type}</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {it.imageUrl && (
                  // if base64 or url
                  <img src={it.imageUrl} alt={it.name} className="w-full h-40 object-cover rounded mb-3" />
                )}

                <p className="text-sm mb-2">{it.description}</p>
                <p className="text-sm font-semibold">Base Price: ₹{it.basePrice}</p>

                {it.variations && Array.isArray(it.variations) && it.variations.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium text-sm">Variations:</div>
                    <ul className="text-sm">
                      {it.variations.map((v, idx) => (
                        <li key={idx}>
                          {v.name} — ₹{v.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingItem(it);
                      setIsFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteMutation.mutate(it.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <MenuItemsForm
          item={editingItem}
          menus={menus}
          categories={categories}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
            qc.invalidateQueries(["menuItems", filterMenuId ?? "all"]);
          }}
        />
      )}
    </div>
  );
}
