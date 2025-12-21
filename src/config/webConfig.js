//config/webConfig.js

export const CONFIG = {
  api: {
    baseUrl: import.meta.env.VITE_BASE_API_URL, // API chính
    storage: import.meta.env.VITE_STORAGE_API_URL, // API lưu trữ file
    data: import.meta.env.VITE_DATA_API_URL, // API data local
    payment: import.meta.env.VITE_PAYMENT_API_URL, // API thanh toán
    cdnUrl: import.meta.env.VITE_CDN_URL, // API cdn
    chatServer: import.meta.env.VITE_CHAT_SERVER_URL, // server realtime chat (socket + API)
    locketApi: import.meta.env.VITE_LOCKET_API_URL, // API Locket chính thức
    exportApi: import.meta.env.VITE_EXPORTS_API_URL, // API export data pdf, excel,...
    convertApi: import.meta.env.VITE_CONVERTS_API_URL,
    extenApi: import.meta.env.VITE_EXTENS_API_URL,
  },

  keys: {
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY, // Push notification
    turnstileKey: import.meta.env.VITE_TURNSTILE_SITE_KEY, // Cloudflare Turnstile

    apiKey: import.meta.env.VITE_PUBLIC_API_KEY,
  },

  app: {
    name: "Locket Dio", // Tên app hiển thị
    author: "dio",
    shortname: "locketdio",
    fullName: "Locket Dio - Đăng ảnh & Video lên Locket", // Tên đầy đủ
    clientVersion: "Beta2.5.5.2", // Version client
    apiVersion: "v2.2.1", // Version API
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
      loadMoreLimit: 50, // Số lượng moments tải thêm mỗi lần
      duplicateThreshold: 3, // Ngưỡng trùng lặp để dừng tải thêm
    },
    messages: {
      initialVisible: 50, // Số lượng messages hiển thị ban đầu
      maxDisplayLimit: 5000, // Giới hạn tối đa messages hiển thị trên client
      loadMoreLimit: 50, // Số lượng messages tải thêm mỗi lần
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
    bankInfo: {
      urlImg: "https://cdn.locket-dio.com/v1/images/qr/dio-mbbank-qr.jpg",
      bankName: "Ngân hàng MBBank (MB)",
      accountNumber: "66222222222266",
      accountName: "DAO VAN DOI",
    },
    docs: {
      personal_authorization:
        "https://docs.google.com/document/d/1c2ttnmPyR3YIYooMj69MlT1XAhCO_xMytHztzi6EaEY/edit?usp=sharing",
    },
    videoTutorials: {
      youtubeChannel: "https://www.youtube.com/@LocketDio",
      iosAddscreen: {
        title: "Hướng dẫn thêm Locket Dio vào màn hình chính trên iPhone!",
        url: "https://www.youtube.com/embed/iElPAnQ7lNY",
      }, // Hướng dẫn thêm trang web vào màn hình chính trên iPhone (Safari)
      androidAddscreen: {
        title: "Hướng dẫn thêm Locket Dio vào màn hình chính trên Android!",
        url: "https://www.youtube.com/embed/JtgfTNbKTZY",
      }, // Hướng dẫn thêm trang web vào màn hình chính trên Android (Chrome)
    },
  },
  ui: {
    theme: "light", // hoặc "dark"
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ],
    maxToastVisible: 3,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm:ss",

    moments: {
      initialVisible: 50,
      maxDisplayLimit: 5000,
      duplicateThreshold: 3,
    },
    chat: { initialVisible: 10 },

    categories: [
      { id: "update", label: "Cập nhật", icon: "Sparkles" },
      { id: "event", label: "Sự kiện", icon: "Gift" },
      { id: "announcement", label: "Thông báo", icon: "Megaphone" },
      { id: "tip", label: "Mẹo sử dụng", icon: "Lightbulb" },
    ],
  },
};
