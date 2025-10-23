// import { useEffect, useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/api/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { uploadFile } from "@/lib/uploadFile"; 

// export default function MenuItemsForm({ item = null, menus = [], categories = [], onClose }) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [menuId, setMenuId] = useState(null);
//   const [category, setCategory] = useState("");
//   const [type, setType] = useState("Veg");
//   const [basePrice, setBasePrice] = useState("");
//   const [variations, setVariations] = useState([]); // [{name, price}]
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (item) {
//       setName(item.name || "");
//       setDescription(item.description || "");
//       setMenuId(item.menuId ?? menus?.[0]?.id ?? null);
//       setCategory(item.category || "");
//       setType(item.type || "Veg");
//       setBasePrice(item.basePrice ?? "");
//       setVariations(Array.isArray(item.variations) ? item.variations : []);
//       setImagePreview(item.imageUrl || null);
//       setIsAvailable(Boolean(item.isAvailable ?? true));
//     } else {
//       setMenuId(menus?.[0]?.id ?? null);
//     }
//   }, [item, menus]);

//   const qc = useQueryClient();

//   const createItem = useMutation({
//     mutationFn: async (payload) => api.post(`/menus/${payload.menuId}/items`, payload),
//     onSuccess: () => {
//       qc.invalidateQueries();
//       onClose();
//     },
//   });

//   const updateItem = useMutation({
//     mutationFn: async (payload) => api.put(`/items/${payload.id}`, payload),
//     onSuccess: () => {
//       qc.invalidateQueries();
//       onClose();
//     },
//   });

//   const handleAddVariation = () => {
//     setVariations((v) => [...v, { name: "", price: "" }]);
//   };

//   const handleVariationChange = (index, key, value) => {
//     setVariations((v) => v.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
//   };

//   const handleRemoveVariation = (index) => {
//     setVariations((v) => v.filter((_, i) => i !== index));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     setImageFile(file || null);
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setImagePreview(url);
//     } else {
//       setImagePreview(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let imageUrl = imagePreview;

// //     if (imageFile) {
// //       try {
// //         setUploading(true);
// //        const res = await uploadFile(imageFile); // res = { success: true, url: '...' }
// // if (res.success) imageUrl = res.url;

// //       } catch (err) {
// //         console.error("Image upload failed:", err);
// //         alert("Image upload failed. Please try again.");
// //         return;
// //       } finally {
// //         setUploading(false);
// //       }
// //     }

// if (imageFile) {
//   try {
//     setUploading(true);
//     const res = await uploadFile(imageFile); 
//     imageUrl = res.url; // always use the Cloudinary URL
//   } catch (err) {
//     console.error("Image upload failed:", err);
//     alert("Image upload failed. Please try again.");
//     return;
//   } finally {
//     setUploading(false);
//   }
// }

// const payload = {
//   name,
//   description,
//   categoryId: Number(category), // map selected category to its id
//   type,
//   imageUrl,
//   basePrice: parseFloat(basePrice), // can be 239.48
//   variations: variations.map((vv) => ({
//     name: vv.name,
//     price: parseFloat(vv.price || 0),
//   })),
//   isAvailable,
//   menuId: Number(menuId),
// };


//     console.log("Payload for menu item creation:", payload);
//     try {
//       if (item) {
//         await updateItem.mutateAsync({ id: item.id, ...payload });
//       } else {
//         await createItem.mutateAsync(payload);
//       }
//     } catch (err) {
//       console.error("Item save error", err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50 overflow-y-auto">
//       <Card className="w-full max-w-3xl my-8">
//         <CardHeader>
//           <CardTitle>{item ? "Edit Item" : "Add Menu Item"}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left Side */}
//             <div className="space-y-3">
//               <label className="text-sm">Name</label>
//               <Input value={name} onChange={(e) => setName(e.target.value)} required />

//               <label className="text-sm">Description</label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
//                 rows={4}
//                 required
//               />

//               <label className="text-sm">Menu</label>
//               <select
//                 value={menuId ?? ""}
//                 onChange={(e) => setMenuId(Number(e.target.value))}
//                 className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
//                 required
//               >
//                 {menus.map((m) => (
//                   <option key={m.id} value={m.id}>
//                     {m.name}
//                   </option>
//                 ))}
//               </select>

//               <label className="text-sm">Category</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
//                 required
//               >
//                 <option value="">Select category</option>
//                 {categories.map((c) => (
//                   <option key={c.id} value={c.name}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>

//               <label className="text-sm">Type</label>
//               <select
//                 value={type}
//                 onChange={(e) => setType(e.target.value)}
//                 className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
//                 required
//               >
//                 <option value="Veg">Veg</option>
//                 <option value="Non-Veg">Non-Veg</option>
//                 <option value="Egg">Egg</option>
//               </select>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={isAvailable}
//                   onChange={(e) => setIsAvailable(e.target.checked)}
//                   id="avail"
//                 />
//                 <label htmlFor="avail" className="text-sm">
//                   Available
//                 </label>
//               </div>
//             </div>

//             {/* Right Side */}
//             <div className="space-y-3">
//               <label className="text-sm">Image</label>
//               <input type="file" accept="image/*" onChange={handleImageChange} />
//               {imagePreview && (
//                 <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded" />
//               )}

//               <label className="text-sm">Base Price</label>
//               <Input
//                 value={basePrice}
//                 onChange={(e) => setBasePrice(e.target.value)}
//                 type="number"
//                 step="0.01"
//                 required
//               />

//               {/* Variations Section */}
//               <div>
//                 <div className="flex flex-wrap justify-between items-center gap-2">
//                   <label className="text-sm">Variations</label>
//                   <Button type="button" onClick={handleAddVariation}>
//                     + Add Variation
//                   </Button>
//                 </div>

//                 <div className="space-y-2 mt-3">
//                   {variations.map((v, idx) => (
//                     <div
//                       key={idx}
//                       className="flex flex-wrap items-center gap-2 bg-[#0E1421]/30 p-2 rounded"
//                     >
//                       <input
//                         placeholder="Name (e.g., Half)"
//                         value={v.name}
//                         onChange={(e) => handleVariationChange(idx, "name", e.target.value)}
//                         className="flex-1 p-2 rounded bg-[#0E1421] border border-gray-700 text-white min-w-[120px]"
//                         required
//                       />
//                       <input
//                         placeholder="Price"
//                         type="number"
//                         step="0.01"
//                         value={v.price}
//                         onChange={(e) => handleVariationChange(idx, "price", e.target.value)}
//                         className="w-28 p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
//                         required
//                       />
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         onClick={() => handleRemoveVariation(idx)}
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <Button variant="outline" type="button" onClick={onClose}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={uploading}>
//                   {uploading ? "Uploading..." : item ? "Update" : "Create"}
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadFile } from "@/lib/uploadFile";

export default function MenuItemsForm({ item = null, menus = [], categories = [], onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [categoryId, setCategoryId] = useState(null); // fixed
  const [type, setType] = useState("Veg");
  const [basePrice, setBasePrice] = useState("");
  const [variations, setVariations] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);

  const qc = useQueryClient();

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setDescription(item.description || "");
      setMenuId(item.menuId ?? menus?.[0]?.id ?? null);
      setCategoryId(item.categoryId ?? (categories?.[0]?.id ?? null)); // fixed
      setType(item.type || "Veg");
      setBasePrice(item.basePrice ?? "");
      setVariations(Array.isArray(item.variations) ? item.variations : []);
      setImagePreview(item.imageUrl || null);
      setIsAvailable(Boolean(item.isAvailable ?? true));
    } else {
      setMenuId(menus?.[0]?.id ?? null);
      setCategoryId(categories?.[0]?.id ?? null); // default selection
    }
  }, [item, menus, categories]);

  const createItem = useMutation({
    mutationFn: async (payload) => api.post(`/menus/${payload.menuId}/items`, payload),
    onSuccess: () => {
      qc.invalidateQueries();
      onClose();
    },
  });

  const updateItem = useMutation({
    mutationFn: async (payload) => api.put(`/items/${payload.id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries();
      onClose();
    },
  });

  const handleAddVariation = () => setVariations(v => [...v, { name: "", price: "" }]);
  const handleVariationChange = (index, key, value) =>
    setVariations(v => v.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  const handleRemoveVariation = (index) => setVariations(v => v.filter((_, i) => i !== index));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    let imageUrl = imagePreview;

    if (imageFile) {
      try {
        setUploading(true);
        const res = await uploadFile(imageFile);
        imageUrl = res.url;
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed. Please try again.");
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload = {
      name,
      description,
      categoryId: Number(categoryId), // now correct
      type,
      imageUrl,
      basePrice: parseFloat(basePrice), // supports 239.48
      variations: variations.map(v => ({ name: v.name, price: parseFloat(v.price || 0) })),
      isAvailable,
      menuId: Number(menuId),
    };

    console.log("Payload for menu item creation:", payload);

    try {
      if (item) {
        await updateItem.mutateAsync({ id: item.id, ...payload });
      } else {
        await createItem.mutateAsync(payload);
      }
    } catch (err) {
      console.error("Item save error", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <CardHeader>
          <CardTitle>{item ? "Edit Item" : "Add Menu Item"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="space-y-3">
              <label className="text-sm">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />

              <label className="text-sm">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
                rows={4}
                required
              />

              <label className="text-sm">Menu</label>
              <select
                value={menuId ?? ""}
                onChange={(e) => setMenuId(Number(e.target.value))}
                className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
                required
              >
                {menus.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>

              <label className="text-sm">Category</label>
              <select
                value={categoryId ?? ""}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
                required
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="text-sm">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
                required
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Egg">Egg</option>
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  id="avail"
                />
                <label htmlFor="avail" className="text-sm">Available</label>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-3">
              <label className="text-sm">Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded" />
              )}

              <label className="text-sm">Base Price</label>
              <Input
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                type="number"
                step="0.01"
                required
              />

              {/* Variations Section */}
              <div>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <label className="text-sm">Variations</label>
                  <Button type="button" onClick={handleAddVariation}>+ Add Variation</Button>
                </div>

                <div className="space-y-2 mt-3">
                  {variations.map((v, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 bg-[#0E1421]/30 p-2 rounded">
                      <input
                        placeholder="Name (e.g., Half)"
                        value={v.name}
                        onChange={(e) => handleVariationChange(idx, "name", e.target.value)}
                        className="flex-1 p-2 rounded bg-[#0E1421] border border-gray-700 text-white min-w-[120px]"
                        required
                      />
                      <input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={v.price}
                        onChange={(e) => handleVariationChange(idx, "price", e.target.value)}
                        className="w-28 p-2 rounded bg-[#0E1421] border border-gray-700 text-white"
                        required
                      />
                      <Button type="button" variant="destructive" onClick={() => handleRemoveVariation(idx)}>Remove</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : item ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
