import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";


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
      setImagePreview(
        item.image
          ? "http://localhost:8000/storage/" + item.image
          : null
      );
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
  formData.append("item_name", name); // ← ⭐ send item name

  try {
    const res = await api.post(
      "/restaurant/menu/item/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // ⭐ SUCCESS TOAST
    toast.success("Image uploaded successfully!");

    // console.log("Uploaded filename:", res.data.filename);

    return res.data.filename; // filename returned by backend
  } catch (err) {
    // console.error("Upload failed:", err.response?.data || err);

    // ⭐ ERROR TOAST
    toast.error("Failed to upload image!");

    return null;
  }
};



  const createItem = useMutation({
    mutationFn: (payload) => api.post("/restaurant/menu/item/add", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item Created successfully!");  // ⭐
      onClose();
    },
    onError: () => {
      toast.error("Failed to Create item");
    }
  });

  const updateItem = useMutation({
    mutationFn: (payload) =>
      api.post(`/restaurant/menu/item/update/${payload.id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success("Item updated successfully!");  // ⭐
      onClose();
    },
    onError: () => {
      toast.error("Failed to update item");
    }
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

    // console.log("Final image path जो डेटाबेसमध्ये जाईल:", finalImagePath);

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
      <Card className="w-full max-w-2xl bg-gray-900 text-white border-gray-800 max-h-[90vh] overflow-hidden">

        <CardHeader>
          <CardTitle className="text-2xl">
            {item ? "Edit Menu Item" : "Add New Item"}
          </CardTitle>
        </CardHeader>

        {/* FORM SCROLL CONTAINER → prevents overflow issues */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[75vh]">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* GRID FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input
                placeholder="Item Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />

              <Input
                type="number"
                step="0.01"
                placeholder="Price *"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="bg-gray-800 border-gray-700"
              />

              <select
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-white"
                value={menuId}
                onChange={(e) => setMenuId(e.target.value)}
              >
                <option value="">Select Menu</option>
                {menus?.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

              <select
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-white"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-white"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="veg">Veg</option>
                <option value="non_veg">Non-Veg</option>
                <option value="egg">Egg</option>
              </select>

              <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg border border-gray-700">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-5 h-5 mr-3"
                />
                <span className="text-lg">Available</span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <textarea
              className="w-full bg-gray-800 p-4 rounded-lg border h-full border-gray-700"
              rows={3}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-sm font-medium mb-2">Item Image</label>
              <div className="flex justify-arround">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-gray-300 file:bg-gray-700 file:text-white file:px-4 file:py-2 file:rounded-lg"
                />

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-[50px] max-h-40 object-fit rounded-lg border border-gray-700"
                    />
                  </div>
                )}


              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
              <Button variant="outline" className="text-gray-800" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
              </Button>
            </div>

          </form>
        </div>
      </Card>
    </div>

  );
}