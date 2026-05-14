import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";
import ErrorBoundary from "./components/pages/ErrorBoundary";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("🔄 Có bản mới, đang cập nhật...");
    updateSW(true); // ✅ Gọi để skipWaiting và reload
  },
  onOfflineReady() {
    console.log("✅ Đã sẵn sàng để dùng offline!");
  },
});

window.addEventListener("error", (event) => {
  const msg = event?.message || "";

  if (
    msg.includes("Loading chunk") ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Unexpected token '<'")
  ) {
    console.log("[APP] Chunk failed -> reload");

    window.location.reload();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  const msg = String(event?.reason || "");

  if (
    msg.includes("Loading chunk") ||
    msg.includes("Failed to fetch dynamically imported module")
  ) {
    console.log("[APP] Import failed -> reload");

    window.location.reload();
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
