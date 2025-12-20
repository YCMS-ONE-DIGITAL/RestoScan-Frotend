import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../api/api"; // your axios instance
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const MenuPage = () => {
  const [newMenu, setNewMenu] = useState("");
  const queryClient = useQueryClient();

  // 🟢 Fetch menus
  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const res = await axios.get("/menus");
      return res.data;
    },
  });

  // 🟡 Create menu
  const createMenu = useMutation({
    mutationFn: async () => {
      await axios.post("/menus", { name: newMenu });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
      setNewMenu("");
    },
  });

  // 🔴 Delete menu
  const deleteMenu = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/menus/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(["menus"]),
  });

  return (
<div className="flex flex-col min-h-0">
      <Card className="p-4 flex-1 ">
        <h2 className="text-xl font-semibold mb-4">Menus</h2>

        <div className="flex gap-2 mb-4">
          <Input
            value={newMenu}
            onChange={(e) => setNewMenu(e.target.value)}
            placeholder="Enter menu name..."
          />
          <Button onClick={() => createMenu.mutate()}>Add Menu</Button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto max-h-full">
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Menu Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id}>
                    <td>{menu.id}</td>
                    <td>{menu.name}</td>
                    <td>
                      <Button
                        variant="destructive"
                        onClick={() => deleteMenu.mutate(menu.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MenuPage;
