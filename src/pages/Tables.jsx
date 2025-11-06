import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "@/components/ui/card";
import AddEditTableModal from "../components/TableComponents/AddTableModal";
import QRModal from "../components/TableComponents/QRmodal"; // ✅ QR Modal Import

export default function TableList() {
  const [tables, setTables] = useState([
    { id: 1, number: "T01", status: "Available", capacity: 4, location: "Window" },
    { id: 2, number: "T02", status: "Occupied", capacity: 2, location: "Entrance" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);

  // ✅ QR Code State
  const [selectedTableForQR, setSelectedTableForQR] = useState(null);

  // Save Handler
  const handleSaveTable = (tableData) => {
    if (editTable) {
      setTables(tables.map((t) => (t.id === tableData.id ? tableData : t)));
    } else {
      setTables([...tables, { ...tableData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditTable(null);
  };

  // Delete
  const handleDelete = (id) => {
    setTables(tables.filter((t) => t.id !== id));
  };

  // Status Change
  const changeStatus = (id) => {
    setTables(tables.map((t) =>
      t.id === id
        ? { ...t, status: t.status === "Available" ? "Occupied" : t.status === "Occupied" ? "Reserved" : "Available" }
        : t
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-white">Tables</h2>
        <Button className="bg-green-600" onClick={() => setIsModalOpen(true)}>+ Add Table</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {tables.map((table) => (
          <Card key={table.id} className="bg-gray-800 text-white">
            <CardHeader className="flex justify-between">
              <CardTitle>Table {table.number}</CardTitle>
              <span
                onClick={() => changeStatus(table.id)}
                className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                  table.status === "Available" ? "bg-green-500/20 text-green-400" :
                  table.status === "Occupied" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}
              >
                {table.status}
              </span>
            </CardHeader>

            <CardContent>
              <p className="text-sm">Seats: {table.capacity}</p>
              <p className="text-sm">Location: {table.location}</p>
            </CardContent>

            <CardFooter className="flex gap-2 justify-between">
              <Button size="sm" variant="outline" className="text-black" onClick={() => { setEditTable(table); setIsModalOpen(true); }}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(table.id)}>Delete</Button>
              <Button size="sm" className="bg-blue-600" onClick={() => setSelectedTableForQR(table)}>
                QR Code
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ✅ Add/Edit Modal */}
      {isModalOpen && (
        <AddEditTableModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditTable(null); }}
          onSave={handleSaveTable}
          editTable={editTable}
        />
      )}

      {/* ✅ QR Modal */}
      <QRModal
        isOpen={!!selectedTableForQR}
        onClose={() => setSelectedTableForQR(null)}
        table={selectedTableForQR}
      />
    </div>
  );
}
