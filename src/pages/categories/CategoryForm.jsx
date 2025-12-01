import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CategoryForm = ({ category, onClose }) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const qc = useQueryClient();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setImagePreview(
        category.image ? "http://localhost:8000/storage/" + category.image : null
      );
    } else {
      setName("");
      setImagePreview(null);
      setImageFile(null);
    }
  }, [category]);

  const uploadImage = async () => {
    if (!imageFile) return null;

    const form = new FormData();
    form.append("file", imageFile);
    form.append("category_name", name);

    try {
      const res = await api.post("/restaurant/category/upload-image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.filename;
    } catch (err) {
      console.log("Upload failed", err);
      return null;
    }
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (category) {
        return api.post(`/restaurant/category/update/${category.id}`, data);
      }
      return api.post("/restaurant/category/add", data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImagePath = null;

    if (imageFile) {
      finalImagePath = await uploadImage();
    } else if (category?.image) {
      finalImagePath = category.image;
    }

    mutation.mutate({
      name,
      image: finalImagePath,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <Card className="w-[90%] max-w-md bg-gray-900 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">
            {category ? "Edit Category" : "Add Category"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <Input
              placeholder="Category name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-gray-800 border-gray-700"
            />

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block mb-2 text-sm">Category Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-sm file:bg-gray-700 file:text-white file:px-4 file:py-2 file:rounded-lg"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-lg border border-gray-700"
                />
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : category ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;
