// src/components/TopToaster.jsx
import { Toaster } from "react-hot-toast";

export default function TopToaster() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,

        style: {
          background: "#1b1b1b",
          color: "#fff",
          padding: "18px 26px",     // ⭐ bigger padding
          borderRadius: "14px",     // ⭐ larger rounded corners
          fontSize: "18px",         // ⭐ bigger text
          fontWeight: "600",        // ⭐ bold text
          boxShadow:
            "0 8px 25px rgba(0,0,0,0.4)", // ⭐ premium shadow
          border: "1px solid #333", // ⭐ subtle border
        },

        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#0f0f0f",
          },
        },

        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#0f0f0f",
          },
        },
      }}
    />
  );
}
