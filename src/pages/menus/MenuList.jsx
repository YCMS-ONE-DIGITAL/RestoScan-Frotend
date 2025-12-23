import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import MenuForm from "./MenuForm";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import ConfirmBox from "../../components/ConfirmBox";
import toast from "react-hot-toast";

const MenuList = () => {
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  // Fetch menus
  const { data: menus = [], isLoading, error } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await api.get("/restaurant/menus");
      // Handle common response patterns
      return res.data?.data || res.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/menus/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu Deleted Successfully");
    },
    onError:()=>{
      toast.error("Failed to Delete Menu")
    }
  });

  const openForm = (menu = null) => {
    setSelectedMenu(menu);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedMenu(null);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading menus...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-400 text-lg">Failed to load menus</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => queryClient.refetchQueries({ queryKey: ["menus"] })}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">Menus</h2>
          <p className="text-gray-400 mt-1">
            {menus.length === 0 ? "No menus yet" : `${menus.length} menu${menus.length > 1 ? "s" : ""} active`}
          </p>
        </div>

        <Button size="lg" onClick={() => openForm()} className="font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Add New Menu
        </Button>
      </div>

      {/* Empty State */}
      {menus.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gray-900 rounded-2xl p-12 max-w-md mx-auto border border-gray-800">
            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Plus className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No menus created yet</h3>
            <p className="text-gray-400 mb-6">Create your first menu to start adding items</p>
            <Button onClick={() => openForm()} size="lg">
              Create First Menu
            </Button>
          </div>
        </div>
      ) : (
        /* Menus Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menus.map((menu) => (
            <Card
              key={menu.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-2xl transition-all duration-300 group"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white group-hover:text-green-400 transition">
                  {menu.name}
                </CardTitle>
                {menu.description && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {menu.description}
                  </p>
                )}
              </CardHeader>

              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => openForm(menu)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setDeleteId(menu.id);
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
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <MenuForm
          menu={selectedMenu}
          onClose={() => {
            closeForm();
            queryClient.invalidateQueries({ queryKey: ["menus"] });
          }}
        />
      )}



      <ConfirmBox
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Menu?"
        message={
          deleteId
            ? `Are you sure you want to delete "${menus.find(m => m.id === deleteId)?.name || ""}"?`
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

export default MenuList;