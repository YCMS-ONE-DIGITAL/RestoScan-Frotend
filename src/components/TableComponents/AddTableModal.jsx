import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddEditTableModal({ isOpen, onClose, onSave, editTable }) {
  const [tableData, setTableData] = useState({
    number: "",
    capacity: "",
    location: "",
    status: "Available",
  });

  const [errors, setErrors] = useState({});

  // ✅ If editing table, pre-fill values
  useEffect(() => {
    if (editTable) {
      setTableData(editTable);
    } else {
      setTableData({ number: "", capacity: "", location: "", status: "Available" });
    }
  }, [editTable]);

  // ✅ Common Input Handler
  const handleChange = (e) => {
    setTableData({ ...tableData, [e.target.name]: e.target.value });
  };

  // ✅ Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!tableData.number.trim()) newErrors.number = "Table Number is required";
    if (!tableData.capacity) newErrors.capacity = "Capacity is required";
    if (tableData.capacity < 1) newErrors.capacity = "Minimum 1 seat required";
    if (!tableData.location.trim()) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(tableData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {editTable ? "Edit Table" : "Add New Table"}
        </h2>

        {/* ✅ Table Number */}
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

        {/* ✅ Capacity */}
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

        {/* ✅ Location */}
        <div className="mb-3">
          <input
            type="text"
            name="location"
            placeholder="Location (e.g. Window Side)"
            value={tableData.location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        {/* ✅ Status Dropdown */}
        <div className="mb-4">
          <select
            name="status"
            value={tableData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-3 text-gray-900 bg-white"
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>

        {/* ✅ Save Button */}
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
