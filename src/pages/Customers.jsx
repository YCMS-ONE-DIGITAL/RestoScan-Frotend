import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  // ✅ Fetch Customers List
  const { data: customers = [], isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      const res = await api.get(`/restaurant/customers?search=${search}`);
      return res.data.data;
    },
  });

  // ✅ Fetch Order History of Selected Customer
  const { data: orderHistory = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["customerOrders", selectedCustomer?.id],
    enabled: !!selectedCustomer,
    queryFn: async () => {
      const res = await api.get(`/restaurant/customer/${selectedCustomer.id}/orders`);
      return res.data.data;
    },
  });

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-xl font-semibold dark:text-white">Customers</h1>

        {/* Search */}
        <div className="relative mt-3 sm:mt-0">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 005.15-1.35z" />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-900 dark:bg-gray-700 text-gray-200 border border-gray-600 rounded-lg"
            placeholder="Search name or phone..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-700 rounded-lg">
          <TableHeader className="bg-gray-700 dark:bg-gray-700">
            <TableRow>
              <TableHead className="text-gray-300">Sr. No</TableHead>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Phone</TableHead>
              <TableHead className="text-gray-300">Total Orders</TableHead>
              <TableHead className="text-gray-300">Last Order</TableHead>
              <TableHead className="text-right text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isCustomerLoading ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4 text-gray-400">
                  Loading...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4 text-gray-400">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-gray-200">{c.id}</TableCell>
                  <TableCell className="text-gray-200">{c.name}</TableCell>
                  <TableCell className="text-gray-200">{c.phone}</TableCell>
                  <TableCell className="text-gray-200">{c.total_orders}</TableCell>
                  <TableCell className="text-gray-200">
                    {c.last_order_time
                      ? new Date(c.last_order_time).toLocaleString()
                      : "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    <button
                      className="text-blue-400 hover:underline"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setOpenPanel(true);
                      }}
                    >
                      View Orders
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Order History Panel */}
      {openPanel && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="w-[400px] bg-gray-900 h-full p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">
                {selectedCustomer?.name}'s Orders
              </h2>
              <button
                className="text-red-400"
                onClick={() => setOpenPanel(false)}
              >
                Close
              </button>
            </div>

            {isHistoryLoading ? (
              <p className="text-gray-400">Loading orders...</p>
            ) : orderHistory.length === 0 ? (
              <p className="text-gray-400">No orders found</p>
            ) : (
              orderHistory.map((o) => (
                <div key={o.id} className="border border-gray-700 p-3 rounded-lg mb-3">
                  <p className="text-white font-medium">
                    Order #{o.id} — ₹{o.total_amount}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(o.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {o.items.length} Items
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
