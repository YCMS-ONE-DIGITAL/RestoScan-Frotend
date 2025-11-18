import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadFile } from "@/lib/uploadFile";

export default function MenuItemsForm({ item, menus = [], categories = [], onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [menuId, setMenuId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("veg");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);

  const qc = useQueryClient();

  // ⁂ LOAD existing item
  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setMenuId(item.menu_id);
      setCategoryId(item.category_id);
      setType(item.type);
      setPrice(item.price);
      setImagePreview(item.image);
      setIsAvailable(item.is_available);
    } else {
      setMenuId(menus?.[0]?.id ?? "");
      setCategoryId(categories?.[0]?.id ?? "");
    }
  }, [item, menus, categories]);

  // ADD Item
  const createItem = useMutation({
    mutationFn: async (payload) => api.post("/restaurant/menu/item/add", payload),
    onSuccess: () => {
      qc.invalidateQueries();
      onClose();
    },
  });

  // UPDATE Item
  const updateItem = useMutation({
    mutationFn: async (payload) =>
      api.post(`/restaurant/menu/item/update/${payload.id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries();
      onClose();
    },
  });

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImage = imagePreview;

    if (imageFile) {
      setUploading(true);
      const uploaded = await uploadFile(imageFile);
      finalImage = uploaded.url;
      setUploading(false);
    }

    const payload = {
      name,
      description,
      category_id: Number(categoryId),
      menu_id: Number(menuId),
      type,
      price,
      image: finalImage,
      is_available: isAvailable,
    };

    if (item) {
      await updateItem.mutateAsync({ id: item.id, ...payload });
    } else {
      await createItem.mutateAsync(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-gray-900 text-white">
        <CardHeader>
          <CardTitle>{item ? "Edit Menu Item" : "Add Menu Item"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              required
            />

            <textarea
              className="w-full bg-gray-800 p-3 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            {/* MENU DROPDOWN */}
            <select
              className="w-full bg-gray-800 p-2 rounded"
              value={menuId}
              onChange={(e) => setMenuId(e.target.value)}
              required
            >
              <option value="">Select Menu</option>
              {(menus ?? []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* CATEGORY DROPDOWN */}
            <select
              className="w-full bg-gray-800 p-2 rounded"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-800 p-2 rounded"
            >
              <option value="veg">Veg</option>
              <option value="non_veg">Non Veg</option>
              <option value="egg">Egg</option>
            </select>

            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              required
            />

            <input type="file" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} className="h-24 mt-2 rounded" />}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              <label>Available</label>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{item ? "Update" : "Create"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
