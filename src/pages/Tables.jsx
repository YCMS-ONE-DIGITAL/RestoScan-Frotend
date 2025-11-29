// src/pages/TableList.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import AddEditTableModal from "../components/TableComponents/AddTableModal";
import QRModal from "../components/TableComponents/QRmodal"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";

export default function TableList() {
  const qc = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [selectedTableForQR, setSelectedTableForQR] = useState(null);

  // ⭐ Fetch restaurant
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await api.get("/restaurant/show");
      return res.data.restaurant;
    },
  });

  // ⭐ Fetch tables
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const res = await api.get(
        `/restaurant/table/list?restaurant_id=${restaurant.id}`
      );
      return res.data.data;
    },
    enabled: !!restaurant,
  });

  // ⭐ Delete
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/table/delete/${id}`),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-white">Tables</h2>
        <Button className="bg-green-600" onClick={() => setIsModalOpen(true)}>
          + Add Table
        </Button>
      </div>

      {isLoading ? (
        <p className="text-white mt-4">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {tables.map((table) => (
            <Card key={table.id} className="bg-gray-800 text-white">
              <CardHeader className="flex justify-between">
                <CardTitle>Table {table.table_no}</CardTitle>
                {/* <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                  Available
                </span> */}
              </CardHeader>

              <CardContent>
                <p className="text-sm">Seats: {table.seating_number}</p>
              </CardContent>

              <CardFooter className="flex gap-2 justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-black bg-white"
                  onClick={() => {
                    setEditTable(table);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(table.id)}
                >
                  Delete
                </Button>

              <Button
  size="sm"
  className="bg-indigo-600 hover:bg-indigo-700"
  onClick={() => restaurant && setSelectedTableForQR(table)}
  disabled={!restaurant}
>
  QR Code
</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit */}
      {isModalOpen && (
        <AddEditTableModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditTable(null);
          }}
          onSave={() => qc.invalidateQueries(["tables"])}
          editTable={editTable}
          restaurantId={restaurant?.id}
        />
      )}

      {/* QR Modal → PASS restaurant */}
      <QRModal
        isOpen={!!selectedTableForQR}
        onClose={() => setSelectedTableForQR(null)}
        table={selectedTableForQR}
        restaurant={restaurant}
      />
    </div>
  );
}
