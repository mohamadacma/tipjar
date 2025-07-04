import { BrowserRouter, Routes, Route } from "react-router-dom";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Checkout from "./pages/checkout";

export default function App() {


  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </BrowserRouter>
  );
}
