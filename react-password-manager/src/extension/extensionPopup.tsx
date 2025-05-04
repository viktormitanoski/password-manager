import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup"; // Assuming it's in src/extension/Popup.tsx
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
