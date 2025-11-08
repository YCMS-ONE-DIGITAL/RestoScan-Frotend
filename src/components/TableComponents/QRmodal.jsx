import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";

export default function QRModal({ isOpen, onClose, table }) {
  if (!isOpen || !table) return null;

const qrURL = `http://localhost:5173/customerwebsite?table=${table.number}`;

  // ✅ Download Function
  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `Table-${table.number}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold mb-4">QR Code for Table {table.number}</h2>

        {/* ✅ Center QR Code */}
        <div className="flex justify-center items-center">
          <QRCodeCanvas id="qr-code" value={qrURL} size={200} includeMargin />
        </div>

        {/* URL Text */}
        <p className="text-xs text-gray-600 mt-3 break-all">{qrURL}</p>

        {/* Download Button */}
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
