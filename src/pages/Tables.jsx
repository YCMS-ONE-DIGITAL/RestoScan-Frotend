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
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";

export default function TableList() {
  const qc = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [selectedTableForQR, setSelectedTableForQR] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
    onSuccess: () => {
      qc.invalidateQueries(["tables"])
      toast.success("Table Deleted Successfully")
    },

    onError: () => {
      toast.success("Failed To  Delete Table")

    }
  });

  return (
    <div className="p-4">
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
                <span className={
                  table.status === "available"
                    ? "px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400"
                    : table.status === "occupied"
                      ? "px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400"
                      : "px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400"
                }>
                  {table.status}
                </span>


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
                  variant="destructive"
                  className="flex"
                  onClick={() => {
                    setDeleteId(table.id);
                    setConfirmOpen(true);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
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


      <ConfirmBox
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Menu?"
        message={
          deleteId
            ? `Are you sure you want to delete "${tables.find(t => t.id === deleteId)?.table_no || ""}"?`
            : ""
        }
        onConfirm={() => {
          deleteMutation.mutate(deleteId);
          setConfirmOpen(false);
        }}

      />
    </div>
  );
}
