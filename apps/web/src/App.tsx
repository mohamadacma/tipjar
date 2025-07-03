import { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayCLick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/checkout", {
        amount: 600,
      });
      const { url } = response.data;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No URL returned from backend");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h1>TipJar</h1>
              <button onClick={handlePayCLick} disabled={isLoading}>
                {isLoading ? "Processing..." : "Checkout"}
              </button>
              {error && <p className="error">Error: {error}</p>}
            </div>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </BrowserRouter>
  );
}
