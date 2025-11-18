import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CategoryForm from "./CategoryForm";

const CategoryList = () => {
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ✅ Fetch categories (Laravel route)
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/restaurant/categories");
      return res.data;
    },
  });

  // ✅ Delete category (Laravel route)
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  if (isLoading) return <p className="p-6">Loading categories...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading categories</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Item Categories</h2>
        <Button onClick={() => { setSelectedCategory(null); setIsFormOpen(true); }}>
          + Add Category
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader>
              <CardTitle>{cat.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => { setSelectedCategory(cat); setIsFormOpen(true); }}
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(cat.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Form */}
      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoryList;
