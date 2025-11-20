import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MenuItemsForm({
  item,
  menus,
  categories,
  restaurantId,
  onClose,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [menuId, setMenuId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("veg");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const qc = useQueryClient();

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setDescription(item.description || "");
      setMenuId(item.menu_id?.toString() || "");
      setCategoryId(item.category_id?.toString() || "");
      setType(item.type || "veg");
      setPrice(item.price?.toString() || "");
      setImagePreview(item.image || null);
      setIsAvailable(item.is_available ?? true);
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setMenuId(menus?.[0]?.id?.toString() || "");
      setCategoryId(categories?.[0]?.id?.toString() || "");
      setType("veg");
      setPrice("");
      setImagePreview(null);
      setImageFile(null);
      setIsAvailable(true);
    }
  }, [item, menus, categories]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // FINAL IMAGE UPLOAD FUNCTION
  const uploadImage = async () => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const res = await api.post(
      "/restaurant/menu/item/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Uploaded filename:", res.data.filename);

    return res.data.filename;     // ⭐ backend मधून येणार "filename"
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err);
    return null;
  }
};



  const createItem = useMutation({
    mutationFn: (payload) => api.post("/restaurant/menu/item/add", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
      onClose();
    },
  });

  const updateItem = useMutation({
    mutationFn: (payload) =>
      api.post(`/restaurant/menu/item/update/${payload.id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
      onClose();
    },
  });

  // FINAL SUBMIT FUNCTION — येथे सगळी जादू आहे!
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImagePath = null;

    // नवीन इमेज असेल तर अपलोड कर
    if (imageFile) {
      finalImagePath = await uploadImage();
    }
    // एडिट करताना जुनी इमेज ठेव
    else if (item?.image) {
      finalImagePath = item.image;
    }

    console.log("Final image path जो डेटाबेसमध्ये जाईल:", finalImagePath);

    const payload = {
  name,
  description: description || null,
  menu_id: Number(menuId),
  category_id: Number(categoryId),
  type,
  price: Number(price),
  image: finalImagePath, // ← फक्त filename जाईल
  is_available: isAvailable,
};



    if (item) {
      updateItem.mutate({ id: item.id, ...payload });
    } else {
      createItem.mutate(payload);
    }
  };

  const isLoading = createItem.isPending || updateItem.isPending;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-gray-900 text-white border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">
            {item ? "Edit Menu Item" : "Add New Item"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input placeholder="Item Name *" value={name} onChange={(e) => setName(e.target.value)} required className="bg-gray-800 border-gray-700" />

            <textarea className="w-full bg-gray-800 p-4 rounded-lg border border-gray-700 focus:border-white outline-none resize-none" rows={3} placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />

            <select className="w-full bg-gray-800 p-4 rounded-lg border border-gray-700 text-white" value={menuId} onChange={(e) => setMenuId(e.target.value)} required>
              <option value="">Select Menu *</option>
              {menus?.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <select className="w-full bg-gray-800 p-4 rounded-lg border border-gray-700 text-white" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">Select Category *</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select className="w-full bg-gray-800 p-4 rounded-lg border border-gray-700 text-white" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="veg">Veg</option>
              <option value="non_veg">Non-Veg</option>
              <option value="egg">Egg</option>
            </select>

            <Input type="number" step="0.01" placeholder="Price *" value={price} onChange={(e) => setPrice(e.target.value)} required className="bg-gray-800 border-gray-700" />

            <div>
              <label className="block text-sm font-medium mb-2">Item Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (imagePreview && imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-gray-700 file:border-0 file:text-white hover:file:bg-gray-600"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg border border-gray-700" />
                  {imageFile && <p className="text-xs text-green-400 mt-2">New image will be uploaded</p>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-5 h-5 rounded" />
              <label className="text-lg">Item is available</label>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}