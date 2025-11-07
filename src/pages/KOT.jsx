import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from '../components/DashboardComponents/OrderCard';

const KOT = () => {
    const navigate = useNavigate();
    const [dateRangeType, setDateRangeType] = useState("today");
    const [startDate, setStartDate] = useState("2025-11-07");
    const [endDate, setEndDate] = useState("2025-11-07");
    const [filterOrders, setFilterOrders] = useState("");

    // Dummy Orders Data
    const orders = [
        {
            id: 7,
            status: "Paid",
            items: 1,
            total: 400,
            time: "November 07, 2025 13:27 PM",
        },
    ];

    return (
        <div className="p-4 bg-gray dark:bg-gray-800 dark:border-gray-700">
            {/* Header */}
            <div className="flex mb-4">
                <h1 className="text-xl font-semibold text-white-900 sm:text-2xl dark:text-white">
                    Orders ({orders.length})
                </h1>
            </div>

            {/* Filters Section */}
            <div className="items-center justify-between block sm:flex ">
                <div className="lg:flex items-center mb-4 sm:mb-0 gap-2">
                    <div className="lg:flex gap-2 items-center">
                        {/* Date Range Selector */}
                        <select
                            value={dateRangeType}
                            onChange={(e) => setDateRangeType(e.target.value)}
                            className="border-gray-300 focus:ring-white-300 rounded-md shadow-sm  bg-gray-900 dark:text-gray-300"
                        >
                            <option value="today">Today</option>
                            <option value="currentWeek">Current Week</option>
                            <option value="lastWeek">Last Week</option>
                            <option value="last7Days">Last 7 Days</option>
                            <option value="currentMonth">Current Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="currentYear">Current Year</option>
                            <option value="lastYear">Last Year</option>
                        </select>

                        {/* Date Picker */}
                        <div className="flex items-center w-full bg-gray">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border-gray-300 text-white-800 bg-gray-600 px-2 py-2 rounded"
                            />
                            <span className="mx-4 text-gray-500">To</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border-gray-300 text-white-800 bg-gray-600 px-2 py-2 rounded"
                            />
                        </div>
                    </div>
                    <div class="whitespace-nowrap items-center font-medium
                        cursor-pointer p-2 text-center rounded-md text-sm border hover:text-gray-900 bg-gray-800
                        hover:bg-gray-200 w-full dark:bg-gray-800 dark:hover:bg-gray-700
                        dark:hover:text-white dark:text-neutral-400">
                       In Kitchen (0)
                    </div>
                    <div class="whitespace-nowrap items-center font-medium
                        cursor-pointer p-2 text-center rounded-md text-sm border hover:text-gray-900 bg-gray-800
                        hover:bg-gray-200 w-full dark:bg-gray-800 dark:hover:bg-gray-700
                        dark:hover:text-white dark:text-neutral-400">
                        Food is Ready (0)
                    </div>
                    <div class="whitespace-nowrap items-center font-medium
                        cursor-pointer p-2 text-center rounded-md text-sm border hover:text-gray-900 bg-gray-800
                        hover:bg-gray-200 w-full dark:bg-gray-800 dark:hover:bg-gray-700
                        dark:hover:text-white dark:text-neutral-400">
                        Food is Served (0)
                    </div>


                </div>

                {/* New Order Button */}
                <button
                    onClick={() => navigate("/pos")}
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-lg"
                >
                    + New Order
                </button>
            </div>

            {/* Orders List */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <OrderCard
                    table="T01"
                    orderNo="3"
                    status="KOT"
                    statusText="Cooking Now"
                    time="November 06, 2025 11:07 AM"
                    items="1 Item(s)"
                    total="$200"
                />
            </div>
        </div>
    );
}

export default KOT