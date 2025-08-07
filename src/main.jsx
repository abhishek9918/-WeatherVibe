import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// ✅ Google Analytics
import ReactGA from "react-ga4";
ReactGA.initialize("G-EHBXEB0MXY"); // ← Your Measurement ID
ReactGA.send("pageview");
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
