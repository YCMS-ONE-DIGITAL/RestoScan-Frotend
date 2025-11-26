import React, { useState, useEffect } from "react";
import api from "@/api/api";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("profile"); // ✅ tabs

  // ✅ User Info
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ✅ Change Password
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // ✅ Restaurant Info
  const [restaurant, setRestaurant] = useState({
    restaurant_name: "",
    address: "",
    contact_number: "",
  });

  // ✅ Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/user/me");
        setUser({
          name: userRes.data.user.name,
          email: userRes.data.user.email,
          phone: userRes.data.user.phone_number,
        });

        const restRes = await api.get("/restaurant/show");
        if (restRes.data.restaurant) {
          setRestaurant({
            restaurant_name: restRes.data.restaurant.restaurant_name,
            address: restRes.data.restaurant.address,
            contact_number: restRes.data.restaurant.contact_number,
          });
        }
      } catch (err) {
        console.error("Error loading settings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Update Functions
  const updateUser = async () => {
    try {
      await api.post("/user/update", user);
      alert("Profile updated ✅");
    } catch {
      alert("Failed to update profile");
    }
  };

  const updatePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await api.post("/user/change-password", passwords);
      alert("Password updated ✅");
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch {
      alert("Incorrect current password");
    }
  };

  const updateRestaurant = async () => {
    try {
      await api.post("/restaurant/update", restaurant);
      alert("Restaurant updated ✅");
    } catch {
      alert("Failed to update restaurant");
    }
  };

  if (loading) return <div className="text-center text-white mt-20">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-3xl mx-auto">
        
        {/* ✅ TAB BUTTONS */}
        <div className="flex gap-3 mb-6 border-b border-gray-700 pb-2">
          {["profile", "password", "restaurant"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded 
                ${selectedTab === tab ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              {tab === "profile" && "Profile"}
              {tab === "password" && "Change Password"}
              {tab === "restaurant" && "Restaurant"}
            </button>
          ))}
        </div>

        {/* ✅ TAB CONTENT */}
        {selectedTab === "profile" && (
          <section className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full mb-3 p-2 rounded bg-gray-700"
              placeholder="Full Name"
            />

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full mb-3 p-2 rounded bg-gray-700 opacity-70 cursor-not-allowed"
              placeholder="Email (cannot change)"
            />

            <input
              type="text"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full mb-3 p-2 rounded bg-gray-700"
              placeholder="Phone Number"
            />

            <button
              onClick={updateUser}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Save Profile
            </button>
          </section>
        )}

        {selectedTab === "password" && (
          <section className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              className="w-full mb-3 p-2 rounded bg-gray-700"
              value={passwords.current_password}
              onChange={(e) =>
                setPasswords({ ...passwords, current_password: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full mb-3 p-2 rounded bg-gray-700"
              value={passwords.new_password}
              onChange={(e) =>
                setPasswords({ ...passwords, new_password: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full mb-4 p-2 rounded bg-gray-700"
              value={passwords.confirm_password}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm_password: e.target.value })
              }
            />

            <button
              onClick={updatePassword}
              className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500"
            >
              Update Password
            </button>
          </section>
        )}

        {selectedTab === "restaurant" && (
          <section className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>

            <input
              type="text"
              value={restaurant.restaurant_name}
              onChange={(e) =>
                setRestaurant({ ...restaurant, restaurant_name: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-700"
              placeholder="Restaurant Name"
            />

            <input
              type="text"
              value={restaurant.address}
              onChange={(e) =>
                setRestaurant({ ...restaurant, address: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-700"
              placeholder="Restaurant Address"
            />

            <input
              type="text"
              value={restaurant.contact_number}
              onChange={(e) =>
                setRestaurant({ ...restaurant, contact_number: e.target.value })
              }
              className="w-full mb-4 p-2 rounded bg-gray-700"
              placeholder="Contact Number"
            />

            <button
              onClick={updateRestaurant}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              Save Restaurant Details
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default Settings;
