import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  // ✅ Dùng đúng chiến lược cập nhật SW
  strategies: "injectManifest",
  srcDir: "src",
  filename: "sw.js",

  // ✅ Auto inject code register SW
  injectRegister: "auto",
  injectManifest: {
    maximumFileSizeToCacheInBytes: 0, // ✅ TẮT HOÀN TOÀN cache tự động
  },

  // ✅ Tự kiểm tra và cập nhật SW khi có bản mới
  registerType: "autoUpdate",

  includeAssets: ["favicon.ico", "apple-touch-icon.png", "maskable-icon-512x512.png"],

  manifest: {
    name: "Locket Dio",
    short_name: "Locket Dio",
    description: "Locket Dio - Đăng ảnh & Video lên Locket",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
};

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  server: {
    host: true,
  },
  plugins: [tailwindcss(), react(), VitePWA(manifestForPlugIn)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // alias @ trỏ vào thư mục src
    },
  },
});
