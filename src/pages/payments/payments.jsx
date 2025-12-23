import React, { useEffect, useState } from "react";
import api from "@/api/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("paid");

  // 🔥 Status Badge Component
  const StatusBadge = ({ status }) => {
    const isPaid = status === "paid";
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full
          ${isPaid ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}
        `}
      >
        {isPaid ? "Paid" : "Pending"}
      </span>
    );
  };

  useEffect(() => {
    api
      .get("restaurant/paymenthistory")
      .then((res) => {
        setPayments(res.data.payments);
      })
      .catch((err) => {
        console.error("Failed to fetch payments", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  // 🔥 Apply Filter
  const filteredPayments = payments.filter((p) => {
    if (filter === "paid") return p.payment_status === "paid";
    if (filter === "pending") return p.payment_status === "pending";
    return true;
  });

  // 🔥 CSV Export
  const downloadCSV = (payments) => {
  if (!payments || payments.length === 0) {
    toast.error("No payments found!");
    return;
  }

  const header = ["Order ID", "Amount", "Payment Method", "Date & Time"];

  const rows = payments.map((p) => [
    `#${p.id}`,
    p.total_amount,
    p.payment_method || "-",
    new Date(p.created_at).toLocaleString(),
  ]);

  // 🔥 CSV escape + quote
  const csvRows = [
    header,
    ...rows
  ].map(row =>
    row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
  );

  // 🔥 BOM added for Excel
  const csvContent = "\uFEFF" + csvRows.join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "payments.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};


  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Payments</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setFilter("paid")}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "paid" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Paid
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Pending
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <input
            className="w-72 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg px-4 py-2"
            placeholder="Search payments..."
          />

          <button
            onClick={() => downloadCSV(payments)}
            className="px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm"
          >
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-700 rounded-lg">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-300">Amount</TableHead>
              <TableHead className="text-gray-300">Payment Method</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Order</TableHead>
              <TableHead className="text-gray-300">Date & Time</TableHead>
              {/* <TableHead className="text-right text-gray-300">Action</TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredPayments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-gray-200">₹{p.total_amount}</TableCell>
                <TableCell className="text-gray-200">{p.payment_method || "-"}</TableCell>

                {/* 🔥 STATUS BADGE */}
                <TableCell>
                  <StatusBadge status={p.payment_status} />
                </TableCell>

                <TableCell className="text-gray-200">#{p.id}</TableCell>
                <TableCell className="text-gray-200">
                  {new Date(p.created_at).toLocaleString()}
                </TableCell>

                {/* <TableCell className="text-right">
                  <button className="text-blue-400 hover:underline">View</button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
