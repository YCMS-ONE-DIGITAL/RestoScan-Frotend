import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    // Change URL if your backend runs on a different port
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("❌ Connection failed: " + err.message));
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>Frontend ↔ Backend Test</h1>
      <p style={{ fontSize: "18px", color: "#333" }}>{message}</p>
    </div>
  );
}

export default App;
