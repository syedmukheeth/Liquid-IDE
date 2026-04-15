import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import axios from "axios";

// 🛡️ SECURITY Fix: Ensure credentials are sent with all API requests
axios.defaults.withCredentials = true;
// import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline support
// registerSW({ immediate: true });

// 🛠️ EMERGENCY Fix: Force-unregister any legacy Service Workers from previous sessions
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
      console.log("🧹 [SAM Compiler] Legacy Service Worker purged.");
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

