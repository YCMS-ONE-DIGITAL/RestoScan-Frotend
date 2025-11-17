import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MenuForm = ({ menu, onClose }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (menu) setName(menu.name);
  }, [menu]);

  // ADD + EDIT mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      // 👉 Editing
      if (menu) {
        return api.post(`/restaurant/menus/update/${menu.id}`, data);
      }
      // 👉 Creating
      return api.post(`/restaurant/menus`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-[90%] max-w-md">
        <CardHeader>
          <CardTitle>{menu ? "Edit Menu" : "Add Menu"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Enter menu name (e.g., Breakfast)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuForm;
