import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X, Download } from "lucide-react";
import { encryptData } from "@/utils/encryption";

export default function QRModal({ isOpen, onClose, table, restaurant }) {
  const qrRef = useRef(null);

  if (!isOpen || !table || !restaurant) return null;

  const rawToken = encryptData({
    restaurant_id: restaurant.id,
    restaurant_name: restaurant.restaurant_name,
    table_no: table.table_no,
    table_id: table.id,
  });

  const token = btoa(rawToken);
  const qrURL = `${window.location.origin}/customerwebsite/menu?token=${token}`;

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return alert("QR not ready!");

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${restaurant.restaurant_name.replace(/[^a-zA-Z0-9]/g, "_")}_Table_${table.table_no}_QR.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-3 sm:p-6 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg animate-fadeIn">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Table QR Code
          </h2>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 text-center">

          <h3 className="text-lg sm:text-2xl font-extrabold text-gray-800 mb-1">
            {restaurant.restaurant_name}
          </h3>

          <p className="text-sm sm:text-lg text-gray-600 font-medium mb-5 sm:mb-6">
            Table No:{" "}
            <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
              {table.table_no}
            </span>
          </p>

          {/* QR Wrapper */}
          <div
            ref={qrRef}
            className="inline-block bg-white p-4 sm:p-6 rounded-2xl shadow-xl border-8 border-gray-100"
          >
            <div className="p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
              <QRCodeCanvas
                value={qrURL}
                size={window.innerWidth < 400 ? 180 : 220} // ✅ responsive QR size
                level="H"
                includeMargin
                imageSettings={{
                  src: "/logo192.png",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-6">
            Scan to View Menu
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 max-w-xs mx-auto">
            Customers can scan this QR to browse menu & place order directly
          </p>

          {/* Download Button */}
          <button
            onClick={downloadQR}
            className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-lg transition-transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
