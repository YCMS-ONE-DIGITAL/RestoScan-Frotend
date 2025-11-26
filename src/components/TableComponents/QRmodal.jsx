// src/components/TableComponents/QRModal.jsx (sirf ye part change kar)

import React, { useRef } from "react";  // ← ye add karna zaroori hai
import { QRCodeCanvas } from "qrcode.react";
import { X, Download } from "lucide-react";
import { encryptData } from "@/utils/encryption";

export default function QRModal({ isOpen, onClose, table, restaurant }) {
  const qrRef = useRef(null);  // ← ye naya add kiya

  if (!isOpen || !table || !restaurant) return null;

  const rawToken = encryptData({
    restaurant_id: restaurant.id,
    table_no: table.table_no,
    table_id: table.id,
  });

  const token = btoa(rawToken);
  const qrURL = `http://localhost:5173/customerwebsite/menu?token=${token}`;

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas"); // ← ye 100% sahi canvas pakdega
    if (!canvas) {
      alert("QR code not ready yet!");
      return;
    }

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${restaurant.restaurant_name.replace(/[^a-zA-Z0-9]/g, "_")}_Table_${table.table_no}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-center">Table QR Code</h2>
        </div>

        <div className="p-8 text-center">

          <h3 className="text-2xl font-extrabold text-gray-800 mb-1">{restaurant.restaurant_name}</h3>
          <p className="text-lg text-gray-600 font-medium mb-6">
            Table No: <span className="text-3xl font-bold text-indigo-600">{table.table_no}</span>
          </p>

          {/* YE HAI MAIN FIX – ref laga diya */}
          <div ref={qrRef} className="inline-block bg-white p-8 rounded-3xl shadow-xl border-8 border-gray-100">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
              <QRCodeCanvas
                value={qrURL}
                size={220}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "/logo192.png", // optional
                  height: 40,
                  width: 40,
                  excavate: true,
                  opacity: 0.9,
                }}
              />
            </div>
          </div>

          <p className="text-sm font-semibold text-gray-700 mt-8">Scan to View Menu</p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Customers can scan this QR code to browse menu & place order directly
          </p>

          {/* Download Button – ab 100% kaam karega */}
          <button
            onClick={downloadQR}
            className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg transform hover:scale-105 transition"
          >
            <Download className="w-5 h-5" />
            Download QR Code
          </button>

        </div>
      </div>
    </div>
  );
}