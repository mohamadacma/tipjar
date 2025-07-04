import { useState } from "react";
import axios from "axios";

export default function Checkout() {
  const [tipAmount, setTipAmount] = useState(700);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/checkout`, {
        amount: tipAmount,
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
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        fontFamily: "sans-serif",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>💸 TipJar</h1>
        <p style={{ marginBottom: "1rem", color: "#ccc" }}>
          You're awesome. Thanks!
        </p>
  
        <input
          type="number"
          value={tipAmount}
          min="100"
          step="100"
          onChange={(e) => setTipAmount(parseInt(e.target.value))}
          style={{
            padding: "0.75rem",
            width: "100%",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#333",
            color: "#fff",
          }}
        />
  
        <button
          onClick={handlePayClick}
          disabled={isLoading}
          style={{
            padding: "0.75rem",
            width: "100%",
            backgroundColor: isLoading ? "#555" : "#4CAF50",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            fontWeight: "bold",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background 0.3s",
          }}
        >
          {isLoading ? "Processing..." : `Tip $${(tipAmount / 100).toFixed(2)}`}
        </button>
  
        {error && (
          <p style={{ marginTop: "1rem", color: "red" }}>Error: {error}</p>
        )}
      </div>
    </div>
  );
        }