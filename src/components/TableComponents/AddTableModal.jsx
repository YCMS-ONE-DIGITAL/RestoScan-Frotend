import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/api/api";
import toast from "react-hot-toast";   // ✅ ADD THIS

export default function AddEditTableModal({ isOpen, onClose, onSave, editTable, restaurantId }) {
  const [tableData, setTableData] = useState({
    number: "",
    capacity: "",
    status: "Available",
  });

  const [errors, setErrors] = useState({});

  // ⭐ Pre-fill when editing
  useEffect(() => {
    if (editTable) {
      setTableData({
        number: editTable.table_no,
        capacity: editTable.seating_number,
status: editTable.status,      });
    } else {
      setTableData({ number: "", capacity: "", status: "Available" });
    }
  }, [editTable]);

  // ⭐ Input handler
  const handleChange = (e) => {
    setTableData({ ...tableData, [e.target.name]: e.target.value });
  };

  // ⭐ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!tableData.number.trim()) newErrors.number = "Table Number required";
    if (!tableData.capacity) newErrors.capacity = "Capacity required";
    if (tableData.capacity < 1) newErrors.capacity = "Minimum 1 seat";
    return newErrors;
  };

  // ⭐ Backend Submit with Toast
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors");  // ❌ validation error toast
      return;
    }

    try {
      if (editTable) {
        // ➤ UPDATE
        await api.post("/restaurant/table/update", {
          table_id: editTable.id,
          table_no: tableData.number,
          seating_number: tableData.capacity,
          status: tableData.status,
        });
        toast.success("Table Updated Successfully ✅"); // ⭐ SUCCESS TOAST
      } else {
        // ➤ ADD
        await api.post("/restaurant/table/add", {
          restaurant_id: restaurantId,
          table_no: tableData.number,
          seating_number: tableData.capacity,
    status: tableData.status.toLowerCase(),
        });
        toast.success("New Table Added Successfully 🎉"); // ⭐ SUCCESS TOAST
      }

      onSave();  
      onClose();

    } catch (err) {
      // console.log("Error:", err);
      toast.error("Something went wrong ❌"); // ❌ ERROR TOAST
      // toast.error(err.errors); // ❌ ERROR TOAST
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm relative">

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {editTable ? "Edit Table" : "Add New Table"}
        </h2>

        <div className="mb-3">
          <input
            type="text"
            name="number"
            placeholder="Table Number"
            value={tableData.number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-3 text-gray-900 bg-white"
          />
          {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
        </div>

        <div className="mb-3">
          <input
            type="number"
            name="capacity"
            placeholder="Number of Seats"
            value={tableData.capacity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-3 text-gray-900 bg-white"
          />
          {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
        </div>

        <div className="mb-3">
  <label className="text-sm text-gray-700">Status</label>
  <select
    name="status"
    value={tableData.status}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded text-gray-900 bg-white mt-1"
  >
    <option value="available">Available</option>
    <option value="occupied">Occupied</option>
  </select>
</div>


        <button
          className="bg-green-600 text-white w-full py-2 rounded font-semibold"
          onClick={handleSubmit}
        >
          {editTable ? "Update Table" : "Add Table"}
        </button>
      </div>
    </div>
  );
}
