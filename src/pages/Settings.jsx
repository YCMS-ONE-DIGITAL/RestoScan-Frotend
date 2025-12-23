import React, { useState, useEffect } from "react";
import api from "@/api/api";
import toast from "react-hot-toast";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("profile");

  // USER INFO
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // PASSWORD
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // RESTAURANT INFO
  const [restaurant, setRestaurant] = useState({
    restaurant_name: "",
    address: "",
    contact_number: "",
    logo: null,
    logo_url: "",
  });

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
            logo: null,
            logo_url: restRes.data.restaurant.logo
              ? "http://localhost:8000/storage/" +
                "/storage/" +
                restRes.data.restaurant.logo
              : "",
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

  const updateUser = async () => {
    try {
      await api.post("/user/update", user);
      // alert("Profile updated");
      toast.success("Profile Updated Successfully")
    } catch {
      // alert("Failed to update profile");
          toast.error("Failed to Update profile")

    }
  };

  const updatePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      // alert("Passwords do not match!");
            toast.error("Passwords do not match!")

      return;
    }

    try {
      await api.post("/user/change-password", {
        old_password: passwords.current_password,
        new_password: passwords.new_password,
        new_password_confirmation: passwords.confirm_password,
      });

      // alert("Password updated");
            toast.success("Password Updated Successfully")


      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      // alert("Incorrect current password");
            toast.error("Incorrect current password")

    }
  };

  // 🔥 UPDATE RESTAURANT (WITH LOGO)
  const updateRestaurant = async () => {
    const formData = new FormData();

    formData.append("restaurant_name", restaurant.restaurant_name);
    formData.append("address", restaurant.address);
    formData.append("contact_number", restaurant.contact_number);

    if (restaurant.logo) {
      formData.append("logo_url", restaurant.logo);
    }

    try {
      await api.post("/restaurant/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // alert("Restaurant updated");
            toast.success("Restaurant Updated Successfully")

    } catch {
      // alert("Failed to update restaurant");
      toast.error("Failed to Updated Restaurant")

    }
  };

  const logoutUser = async () => {
    try {
      await api.get("/user/logout");
      window.location.href = "/login";
    } catch {
      // alert("Failed to logout");
      toast.error("Failed to logout")
    }
  };

  if (loading)
    return <div className="text-center text-white mt-20">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-3xl mx-auto">
        {/* TABS */}
        <div className="flex gap-3 mb-6 border-b border-gray-700 pb-2">
          {["profile", "password", "restaurant"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded ${
                selectedTab === tab
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {tab === "profile" && "Profile"}
              {tab === "password" && "Change Password"}
              {tab === "restaurant" && "Restaurant"}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
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
              className="w-full mb-3 p-2 rounded bg-gray-700 opacity-70"
            />

            <input
              type="text"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full mb-3 p-2 rounded bg-gray-700"
              placeholder="Phone Number"
            />

            <div className="flex justify-between">
              <button
                onClick={updateUser}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                Save Profile
              </button>

              <button
                onClick={logoutUser}
                className="px-4 py-2 bg-red-600 rounded"
              >
                Logout
              </button>
            </div>
          </section>
        )}

        {/* PASSWORD TAB */}
        {selectedTab === "password" && (
          <section className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              className="w-full mb-3 p-2 rounded bg-gray-700"
              value={passwords.current_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  current_password: e.target.value,
                })
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
                setPasswords({
                  ...passwords,
                  confirm_password: e.target.value,
                })
              }
            />

            <button
              onClick={updatePassword}
              className="px-4 py-2 bg-yellow-600 rounded"
            >
              Update Password
            </button>
          </section>
        )}

        {/* RESTAURANT TAB */}
        {selectedTab === "restaurant" && (
          <section className="bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>

            <input
              type="text"
              value={restaurant.restaurant_name}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  restaurant_name: e.target.value,
                })
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
                setRestaurant({
                  ...restaurant,
                  contact_number: e.target.value,
                })
              }
              className="w-full mb-4 p-2 rounded bg-gray-700"
              placeholder="Contact Number"
            />

            {/* LOGO UPLOAD */}
            <div className="mb-4">
              <label>Restaurant Logo</label>

              <input
                type="file"
                accept="image/*"
                className="w-full mt-2 p-2 bg-gray-700 rounded"
                onChange={(e) =>
                  setRestaurant({
                    ...restaurant,
                    logo: e.target.files[0],
                  })
                }
              />

              {/* OLD LOGO */}
              {restaurant.logo_url && !restaurant.logo && (
                <img
                  src={restaurant.logo_url}
                  className="h-20 mt-3 border rounded"
                />
              )}

              {/* NEW PREVIEW */}
              {restaurant.logo && (
                <img
                  src={URL.createObjectURL(restaurant.logo)}
                  className="h-20 mt-3 border rounded"
                />
              )}
            </div>

            <button
              onClick={updateRestaurant}
              className="px-4 py-2 bg-green-600 rounded"
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
