import { registerSW } from "virtual:pwa-register";

export function initPWA() {
  const updateSW = registerSW({
    onNeedRefresh() {
      console.log("🔄 Có bản mới, đang cập nhật...");

      updateSW(true);
    },

    onOfflineReady() {
      console.log("✅ Đã sẵn sàng offline");
    },
  });

  return updateSW;
}