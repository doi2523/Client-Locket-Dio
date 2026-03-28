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

  manifest: false,
};

const brand = process.env.VITE_BRAND;
const publicDir = brand ? `public-${brand}` : "public";

export default defineConfig({
  publicDir,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  server: {
    host: true,
  },
  plugins: [tailwindcss(), react(), VitePWA(manifestForPlugIn), visualizer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // alias @ trỏ vào thư mục src
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          icons: ["lucide-react", "react-icons"],
          swiper: ["swiper"],
          tour: ["driver.js"],
          marquee: ["react-fast-marquee"],
          toast: ["sonner"],
          crop: ["react-easy-crop"],
          vendor: ["axios", "zustand", "dexie"]
        },
      },
    },
    chunkSizeWarningLimit: 1500, // tăng giới hạn warning, đỡ spam console
  },
});
