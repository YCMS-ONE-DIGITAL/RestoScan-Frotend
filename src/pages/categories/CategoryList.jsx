import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CategoryForm from "./CategoryForm";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import ConfirmBox from "../../components/ConfirmBox";
import toast from "react-hot-toast";

const baseURL = "http://localhost:8000/storage/";

const CategoryList = () => {
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/restaurant/categories");
      return res.data?.data || res.data || [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category Deleted Successfully ")
    },
    onError:()=>{
      toast.error("Failed to delete Category")
    }
  });

  const openForm = (category = null) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96 bg-gray-950">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        <span className="ml-3 text-gray-400 text-lg">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-gray-950 min-h-96 flex flex-col items-center justify-center">
        <p className="text-red-400 text-lg mb-4">Failed to load categories</p>
        <Button onClick={() => qc.refetchQueries({ queryKey: ["categories"] })}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6  text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Item Categories</h2>
          <p className="text-gray-400 mt-1">{categories.length} categories</p>
        </div>

        <Button size="lg" onClick={() => openForm()}>
          <Plus className="w-5 h-5 mr-2" /> Add Category
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all overflow-hidden group"
          >
            {/* CATEGORY IMAGE */}
            {cat.image ? (
              <img
                src={baseURL + cat.image}
                alt={cat.name}
                className="w-full h-40 object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x200.png?text=No+Image")
                }
              />
            ) : (
              <div className="w-full h-40 bg-gray-800 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold truncate text-white">
                {cat.name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex gap-3 mt-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => openForm(cat)}
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>

                <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDeleteId(cat.id);
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

      {/* MODAL */}
      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => {
            closeForm();
            qc.invalidateQueries({ queryKey: ["categories"] });
          }}
        />
      )}

       <ConfirmBox
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Cat?"
        message={
          deleteId
            ? `Are you sure you want to delete "${categories.find(m => m.id === deleteId)?.name || ""}"?`
            : ""
        }
        onConfirm={() => {
          deleteMutation.mutate(deleteId);
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default CategoryList;
