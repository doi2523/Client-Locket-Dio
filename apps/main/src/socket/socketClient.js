// src/socket/socketClient.js
import { API_ENDPOINTS } from "@/config/apiConfig";
import { io } from "socket.io-client";

export const createSocket = (idToken, { onConnect, onDisconnect, onError } = {}) => {
  if (!idToken) return null;

  const socketClient = io(API_ENDPOINTS.socketUrl, {
    transports: ["websocket"],
    auth: { token: idToken },
    autoConnect: false,
    // ✅ RECONNECT CONFIG
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  });

  // Trạng thái kết nối
  socketClient.on("connect", () => {
    console.log("Socket connected:", socketClient.id);
    onConnect?.(socketClient);
  });

  socketClient.on("disconnect", () => {
    console.log("Socket disconnected");
    onDisconnect?.();
  });

  socketClient.on("connect_error", (err) => {
    console.error("Connect error:", err.message);
    onError?.(err);
  });

  socketClient.connect();
  return socketClient;
};
