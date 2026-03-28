/**
 * Centralized endpoint configuration for LiquidIDE
 * Ensures that API and WebSocket traffic are routed correctly
 * between Vercel (REST) and Render (WebSockets).
 */

const isProduction = window.location.hostname !== "localhost" && !window.location.hostname.includes("127.0.0.1");
const isVercel = window.location.hostname.includes("vercel.app");

export const ENDPOINTS = {
  // REST API Endpoint
  // In production, we use the Vercel mirror for API speed, or same-origin if not on Vercel.
  API_BASE_URL: isVercel ? "https://liquid-ide-api.vercel.app" : window.location.origin,

  // WebSocket Endpoint 
  // CRITICAL: Vercel does not support persistent WebSockets. 
  // We MUST route all socket traffic (Socket.io/Yjs) to a dedicated server (Render).
  WS_ENDPOINT: isProduction 
    ? "https://liquid-ide.onrender.com" 
    : window.location.origin.replace(":3000", ":3001"),

  IS_PRODUCTION: isProduction,
  IS_VERCEL: isVercel
};

export default ENDPOINTS;
