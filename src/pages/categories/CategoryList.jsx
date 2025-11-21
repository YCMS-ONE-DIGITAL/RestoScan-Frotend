import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CategoryForm from "./CategoryForm";
import { Plus, Edit, Trash2, Loader2, FolderOpen } from "lucide-react";

const CategoryList = () => {
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch categories (handles common Laravel response patterns)
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/restaurant/categories");
      // Safely extract array from various response formats
      return res.data?.data || res.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const openForm = (category = null) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96 bg-gray-950">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading categories...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6 text-center bg-gray-950 min-h-96 flex flex-col items-center justify-center">
        <p className="text-red-400 text-lg mb-4">Failed to load categories</p>
        <Button
          variant="outline"
          onClick={() => qc.refetchQueries({ queryKey: ["categories"] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Item Categories</h2>
          <p className="text-gray-400 mt-1">
            {categories.length === 0
              ? "No categories yet"
              : `${categories.length} categor${categories.length > 1 ? "ies" : "y"}`}
          </p>
        </div>

        <Button size="lg" onClick={() => openForm()} className="font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gray-900 rounded-2xl p-12 max-w-md mx-auto border border-gray-800">
            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">No categories created</h3>
            <p className="text-gray-400 mb-8">
              Organize your menu items by creating categories like Pizza, Burgers, Drinks, etc.
            </p>
            <Button onClick={() => openForm()} size="lg">
              Create First Category
            </Button>
          </div>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-white group-hover:text-green-400 transition">
                    {cat.name}
                  </CardTitle>
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center opacity-60 group-hover:opacity-100 transition">
                    <FolderOpen className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
                {cat.description && (
                  <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </CardHeader>

              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => openForm(cat)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (confirm(`Delete "${cat.name}" category permanently?`)) {
                        deleteMutation.mutate(cat.id);
                      }
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

      {/* Form Modal */}
      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => {
            closeForm();
            qc.invalidateQueries({ queryKey: ["categories"] });
          }}
        />
      )}
    </div>
  );
};

export default CategoryList;