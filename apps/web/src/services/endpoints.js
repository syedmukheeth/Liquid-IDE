/**
 * 🌑 Centralized endpoint configuration for SAM Compiler
 * Ensures that API and WebSocket traffic are routed correctly
 * to the monolithic Render backend.
 */

// HARDENED: Definitively targets the monolithic Render domain as the source of truth
const RENDER_BASE = "https://sam-compiler.onrender.com";

const isProduction = import.meta.env.PROD;
const isVercel = window.location.hostname.includes("vercel.app");

export const ENDPOINTS = {
  // REST API Endpoint: Prioritizes environment variables, falls back to the production monolith
  API_BASE_URL: (import.meta.env.VITE_API_URL || RENDER_BASE).replace(/\/+$/, ""),

  // WebSocket Endpoint: Essential for real-time collaborative synchronization
  WS_ENDPOINT: (import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_URL || RENDER_BASE).replace(/\/+$/, ""),

  // SOCKET_OPTIONS: Optimized for Render's container handshake
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
