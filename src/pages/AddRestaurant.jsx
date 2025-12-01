import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AddRestaurant() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    restaurant_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contact_number: "",
  });

  const [logo, setLogo] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (logo) formData.append("logo", logo);

    try {
      const res = await api.post("/restaurant/store", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.status === "success") {
        alert("Restaurant saved successfully!");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save restaurant");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-[420px] space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Register Your Restaurant
        </h2>

        <input
          name="restaurant_name"
          placeholder="Restaurant Name *"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Full Address"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <div className="flex gap-2">
          <input
            name="city"
            placeholder="City"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="state"
            placeholder="State"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <input
          name="pincode"
          placeholder="Pincode"
          maxLength="10"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="contact_number"
          placeholder="Restaurant Contact Number"
          maxLength="15"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        {/* LOGO UPLOAD */}
        <div>
          <label className="block text-gray-700">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            className="w-full border p-2 rounded"
          />

          {logo && (
            <img
              src={URL.createObjectURL(logo)}
              alt="Preview"
              className="h-20 mt-2 rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
