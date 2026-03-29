/**
 * Centralized endpoint configuration for LiquidIDE
 * Ensures that API and WebSocket traffic are routed correctly
 * between Vercel (REST) and Render (WebSockets).
 */

const isProduction = window.location.hostname !== "localhost" && !window.location.hostname.includes("127.0.0.1");
const isVercel = window.location.hostname.includes("vercel.app");

export const ENDPOINTS = {
  // REST API Endpoint
  // ALIGNMENT: In production, route ALL traffic to Render to avoid Vercel proxy issues
  API_BASE_URL: isProduction 
    ? "https://liquid-ide.onrender.com" 
    : window.location.origin,

  // WebSocket Endpoint 
  WS_ENDPOINT: isProduction 
    ? "https://liquid-ide.onrender.com" 
    : window.location.origin.replace(":3000", ":3001"),

  // SOCKET_OPTIONS: Polling first for max reliability on Render free-tier
  SOCKET_OPTIONS: {
     transports: ["polling", "websocket"],
     reconnection: true,
     reconnectionAttempts: 50,
     timeout: 30000
  },

  IS_PRODUCTION: isProduction,
  IS_VERCEL: isVercel
};

export default ENDPOINTS;
