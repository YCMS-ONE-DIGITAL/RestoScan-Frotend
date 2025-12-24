import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

const MenuForm = ({ menu, onClose }) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (menu) setName(menu.name);
  }, [menu]);

  // ADD + EDIT mutation
  const mutation = useMutation({
  mutationFn: async (data) => {
    if (menu) {
      return api.post(`/restaurant/menus/update/${menu.id}`, data);
    }
    return api.post(`/restaurant/menus/add`, data);
  },

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["menus"] });

    if (menu) {
      toast.success("Menu updated successfully!");
    } else {
      toast.success("Menu created successfully!");
    }

    // ⭐ FORM बंद करा – हे अत्यंत महत्वाचे!
    onClose();
  },

  onError: () => {
    toast.error("Failed to save menu!");
  }

  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-[90%] max-w-md bg-gray-900">
        <CardHeader className="text-gray-300">
          <CardTitle>{menu ? "Edit Menu" : "Add Menu"}</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-200 ">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Enter menu name (e.g., Breakfast)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" className="text-gray-800" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={mutation.isPending}>
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
