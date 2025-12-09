import React, { useState, useEffect } from "react";
import api from "@/api/api";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StaffForm = ({ staffId, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);


  const isEdit = Boolean(staffId);

  // FETCH ONE STAFF on EDIT
  useEffect(() => {
    if (isEdit) {
      fetchStaff();
    }
  }, [staffId]);

  const fetchStaff = async () => {
    try {
      const res = await api.get(`restaurant/staff/fetchone/${staffId}`);
        
      if (res.data.status === "success") {
        setForm({
          name: res.data.data.name,
          email: res.data.data.email,
          phone: res.data.data.phone,
          role: res.data.data.role,
          password: res.data.data.password,
        });
      }
    } catch (err) {
      toast.error("Failed to load staff details");
    }
  };

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isEdit) {
        res = await api.post(`restaurant/staff/update/${staffId}`, form);
      } else {
        res = await api.post("restaurant/staff/add", form);
      }

      if (res.data.status === "success") {
        toast.success(isEdit ? "Staff updated!" : "Staff added!");
        onClose();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
        const msg =
      err?.response?.data?.errors?.email?.[0] ||
      err?.response?.data?.errors?.phone?.[0] ||
      err?.response?.data?.errors?.name?.[0] ||
      err?.response?.data?.message ||
      "Failed to save staff";

    toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <Card className="w-[90%] max-w-md bg-gray-900 text-white border-gray-700">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Staff" : "Add Staff"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <input
              type="text"
              name="name"
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              placeholder="Name *"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              placeholder="Phone *"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="waiter">Waiter</option>
              <option value="manager">Manager</option>
            </select>

           <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    className="p-2 w-full bg-gray-800 border border-gray-700 rounded pr-10"
    placeholder={isEdit ? "Change Password (optional)" : "Password *"}
    value={form.password}
    onChange={handleChange}
    required={!isEdit}
  />

  {/* EYE ICON */}
  <span
    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3l18 18M10.584 10.587A3 3 0 0113.41 13.41m3.53 3.53C15.93 18.56 14.05 19 12 19c-5 0-9-5-9-7 0-1.02 1.05-2.85 2.8-4.47m4.06-2.33C11.1 5.1 11.54 5 12 5c5 0 9 5 9 7 0 .9-.65 2.33-1.75 3.75"
        />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )}
  </span>
</div>


            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={onClose} className="text-gray-900">
                Cancel
              </Button>

              <Button type="submit">
                {isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffForm;
