import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import MenuForm from "./MenuForm";

const MenuList = () => {
  const queryClient = useQueryClient();
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch menus from Laravel
  const { data: menus, isLoading, error } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await api.get("/restaurant/menus");   // 👈 FIXED
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/menus/${id}`), // 👈 FIXED
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
    },
  });

  if (isLoading) return <p className="p-6">Loading menus...</p>;
  if (error) return <p className="p-6 text-red-500">Error fetching menus</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Menus</h2>
        <Button onClick={() => { setSelectedMenu(null); setIsFormOpen(true); }}>
          + Add Menu
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardHeader>
              <CardTitle>{menu.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => { setSelectedMenu(menu); setIsFormOpen(true); }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(menu.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <MenuForm
          menu={selectedMenu}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default MenuList;
