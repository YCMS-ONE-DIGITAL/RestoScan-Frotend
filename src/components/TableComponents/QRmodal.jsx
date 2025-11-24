// src/components/TableComponents/QRModal.jsx
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";
import { encryptData } from "@/utils/encryption";

export default function QRModal({ isOpen, onClose, table, restaurant }) {
  // console.log(table.id)
  if (!isOpen || !table || !restaurant) return null;

  // Create secure encrypted token
  // encrypt restaurant + table
const rawToken = encryptData({
  restaurant_id: restaurant.id,
  table_no: table.table_no,
  table_id: table.id,       // ← unique table ID

});

// Base64 encode → URL safe
const token = btoa(rawToken);

// FINAL URL with token (NO encodeURIComponent)
const qrURL = `http://localhost:5173/customerwebsite/menu?token=${token}`;


  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${restaurant.name}-Table-${table.table_no}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center relative">

        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4">
          QR Code for {restaurant.name} – Table {table.table_no}
        </h2>

        <div className="flex justify-center items-center">
          <QRCodeCanvas id="qr-code" value={qrURL} size={200} includeMargin />
        </div>

        <p className="text-xs text-gray-600 mt-3 break-all">{qrURL}</p>

        <button
          onClick={downloadQR}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Download QR
        </button>
      </div>
    </div>
  );
}
