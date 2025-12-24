import React, { useEffect, useMemo, useState } from "react";
import api from "@/api/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import toast from "react-hot-toast";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("paid");

  /* ---------------- PAGINATION ---------------- */
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  /* ---------------- STATUS BADGE ---------------- */
  const StatusBadge = ({ status }) => {
    const isPaid = status === "paid";
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full
          ${
            isPaid
              ? "bg-green-600/20 text-green-400"
              : "bg-red-600/20 text-red-400"
          }
        `}
      >
        {isPaid ? "Paid" : "Pending"}
      </span>
    );
  };

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    api
      .get("restaurant/paymenthistory")
      .then((res) => {
        setPayments(res.data.payments || []);
      })
      .catch(() => toast.error("Failed to fetch payments"))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (filter === "paid") return p.payment_status === "paid";
      if (filter === "pending") return p.payment_status === "pending";
      return true;
    });
  }, [payments, filter]);

  /* ---------------- PAGINATED DATA ---------------- */
  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE);

  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPayments.slice(start, start + PAGE_SIZE);
  }, [filteredPayments, page]);

  /* ---------------- CSV ---------------- */
  const downloadCSV = (data) => {
    if (!data.length) return toast.error("No payments found!");

    const header = ["Order ID", "Amount", "Payment Method", "Date"];
    const rows = data.map((p) => [
      `#${p.id}`,
      p.total_amount,
      p.payment_method || "-",
      new Date(p.created_at).toLocaleString(),
    ]);

    const csv =
      "\uFEFF" +
      [header, ...rows]
        .map((r) => r.map((v) => `"${v}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Loading payments...
      </div>
    );
  }

  return (
    <div>
      {/* ---------------- HEADER ---------------- */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-xl font-semibold text-white">Payments</h1>

        <div className="flex gap-2">
          {["paid", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={() => downloadCSV(filteredPayments)}
          className="px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg text-sm"
        >
          Export CSV
        </button>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-700 rounded-lg">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-300">Amount</TableHead>
              <TableHead className="text-gray-300">Method</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Order</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedPayments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-gray-200">
                  ₹{p.total_amount}
                </TableCell>
                <TableCell className="text-gray-200">
                  {p.payment_method || "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.payment_status} />
                </TableCell>
                <TableCell className="text-gray-200">#{p.id}</TableCell>
                <TableCell className="text-gray-200 text-sm">
                  {new Date(p.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}

            {!paginatedPayments.length && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-400 py-6"
                >
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
