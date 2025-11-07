import { CONFIG } from "./webConfig";

// src/config/api.js
const isLocal = window.location.hostname === "localhost";

// Base URL
const PROTOCOL = isLocal ? "http" : "https";
const SOCKET_PROTOCOL = isLocal ? "ws" : "wss";

// Chat server host
const CHAT_SERVER_HOST = CONFIG.api.chatServer;

// Namespace
export const API_NAMESPACE = {
  main: "/api",
  locket: "/locket",
  chat: "/chat",
};

// Endpoints
export const API_ENDPOINTS = {
  // Socket URL
  socketUrl: `${SOCKET_PROTOCOL}://${CHAT_SERVER_HOST}${API_NAMESPACE.chat}`,

  // REST endpoints
  getAllMessages: `${PROTOCOL}://${CHAT_SERVER_HOST}${API_NAMESPACE.locket}/getAllMessageV2`,
  getMessagesWithUser: `${PROTOCOL}://${CHAT_SERVER_HOST}${API_NAMESPACE.locket}/getMessageWithUserV2`,
};
