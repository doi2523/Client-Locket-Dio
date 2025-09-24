//config/webConfig.js

export const CONFIG = {
  api: {
    baseUrl: import.meta.env.VITE_BASE_API_URL, // API chính
    storage: import.meta.env.VITE_STORAGE_API_URL, // API lưu trữ file
    database: import.meta.env.VITE_DATABASE_API_URL, // API database
    payment: import.meta.env.VITE_PAYMENT_API_URL, // API thanh toán
    cdn: import.meta.env.VITE_CDN_URL, // API cdn
  },

  keys: {
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY, // Push notification
    turnstileKey: import.meta.env.VITE_TURNSTILE_SITE_KEY, // Cloudflare Turnstile
  },

  app: {
    name: "Locket Dio", // Tên app hiển thị
    fullName: "Locket Dio - Đăng ảnh & Video lên Locket", // Tên đầy đủ
    clientVersion: "Beta2.5.4.0.5", // Version client
    apiVersion: "V2.2.1", // Version API
    env: import.meta.env.MODE, // development | production
    camera: {
      limits: {
        maxRecordTime: 10, // giây
        maxImageSizeMB: 10,
        maxVideoSizeMB: 10,
      },
      resolutions: {
        imageSizePx: 1920, // ảnh vuông
        videoResolutionPx: 1080,
      },
      constraints: {
        default: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        ultraHD: {
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
      },
    },
    moments: {
      initialVisible: 50, // Số lượng moments hiển thị ban đầu
      maxDisplayLimit: 5000, // Giới hạn tối đa moments hiển thị trên client
      duplicateThreshold: 3, // Ngưỡng trùng lặp để dừng tải thêm
    },
    contact: {
      supportEmail: "doibncm2003@gmail.com",
      supportNumber: "1800-123-456",
    },
    community: {
      discord: "https://discord.com/invite/47buy9nMGc",
      telegram: "https://t.me/ddevdio",
      messenger: "https://m.me/cm/AbYPtgRiGe2fInEf",
    },
    sponsors: {
      urlImg: "https://cdn.locket-dio.com/v1/images/qr/vcb_qr.jpg",
      bankName: "Ngân hàng Vietcombank (VCB)",
      accountNumber: "1051852055",
      accountName: "DAO VAN DOI",
    },
    docs: {
      personal_authorization: "https://docs.google.com/document/d/1c2ttnmPyR3YIYooMj69MlT1XAhCO_xMytHztzi6EaEY/edit?usp=sharing"
    }
  },
  ui: {
    theme: "light", // hoặc "dark"
    themes: [
      "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
      "synthwave", "retro", "valentine", "halloween", "garden", "forest",
      "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
      "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
    ],
    maxToastVisible: 3,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm:ss",
  },
};
