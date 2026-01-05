import { CONFIG } from "./webConfig";

// Chat server host
export const BASE_SERVER_HOST = CONFIG.api.baseUrl;
export const BETA_SERVER_HOST = import.meta.env.VITE_BETA_API_URL;
// Namespace
export const API_NAMESPACE = {
  main: "/api",
  locket: "/locket",
  chat: "/chat",
};

// Endpoints
export const API_ENDPOINTS = {
  // Socket URL
  socketUrl: BASE_SERVER_HOST,
};


export const PUBLIC_API = {
  feeds: "v1/public/feeds",
  donations: "v1/public/donations",
  timelines: "v1/public/timelines",
  frames: "v1/public/myframes",
  celebrates: "v1/public/getAllCelebrate",
  notifications: "v1/public/notification",
  plans: "v1/public/dio-plans",
  themes: "v1/public/themes",
  incidents: "v1/public/getAllIncident"
};