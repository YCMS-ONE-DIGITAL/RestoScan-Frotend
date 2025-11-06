import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";

export default function QRModal({ isOpen, onClose, table }) {
  if (!isOpen || !table) return null;

  // ✅ QR मध्ये जाणारा URL (इथे तुमच्या प्रोजेक्टचा link दे)
  // const qrURL = `https://yourdomain.com/customer?table=${table.number}`;
  const qrURL = `http://localhost:5173/customerwebsite`;

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
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4">QR Code for Table {table.number}</h2>

        <QRCodeCanvas id="qr-code" value={qrURL} size={200} includeMargin />

        <p className="text-xs text-gray-600 mt-3">{qrURL}</p>

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
