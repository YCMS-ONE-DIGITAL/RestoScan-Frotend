import React, { useState, useEffect } from "react";

const Settings = () => {
  // State to store restaurant name
  const [restaurantName, setRestaurantName] = useState("");

  // ✅ (Optional) Load initial value from backend/localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("restaurantName");
    if (savedName) setRestaurantName(savedName);
  }, []);

  // ✅ Save the restaurant name (You can later replace this with API call)
  const handleSave = () => {
    if (!restaurantName.trim()) {
      alert("Restaurant name cannot be empty!");
      return;
    }
    localStorage.setItem("restaurantName", restaurantName); // (Replace with API to save in DB)
    alert("Restaurant Name Updated ✅");
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen dark:bg-gray-900">
      <div className="max-w-xl mx-auto bg-gray-600 dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-300 dark:text-white mb-4">
          Settings
        </h2>

        <div className="mb-4">
          <label className="block text-gray-300 dark:text-gray-300 mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Enter Restaurant Name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 
                       rounded-md bg-gray-700 dark:bg-gray-900 text-gray-300 
                       dark:text-gray-300 focus:outline-none focus:ring-2 
                       focus:ring-skin-base"
          />
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-skin-base/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
