import { useState } from "react";
import axios from "axios";


export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/checkout", {
        amount: 500, // $5.00 in cents
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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>TipJar</h1>
      <button
        onClick={handlePayClick}
        disabled={isLoading}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1.25rem",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Redirecting…" : "Pay $5.00"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
