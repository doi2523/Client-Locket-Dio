// config/app.config.js

const serverConfig = {
  appConfig: { port: process.env.PORT || 5000 },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    apiKey: process.env.FIREBASE_API_KEY,
    apiBase: {
      appCheck: process.env.FIREBASE_APPCHECK_API_BASE,
      auth: process.env.FIREBASE_AUTH_API_BASE,
      firestore: process.env.FIREBASE_FIRESTORE_API_BASE,
      secureToken: process.env.FIREBASE_SECURETOKEN_API_BASE,
    },
  },

  function: {
    locketApi: process.env.LOCKET_API_BASE,
  },

  security: {
    cookieSecret: process.env.COOKIE_SECRET,
    vapid: {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
    },
  },

  integrations: {
    weatherApiKey: process.env.WEATHER_API_KEY,
  },

  services: {
    storageUrl: process.env.STORAGE_API_URL || "https://storage.locket-dio.com",
    redisUrl: process.env.REDIS_URL,
  },

  limits: {
    maxUploadSize: Number(process.env.MAX_UPLOAD_SIZE) || 150, // 150MB
    maxVideoSizeMB: Number(process.env.MAX_VIDEO_SIZE_MB) || 5,
    maxVideoSizeBytes: Number(process.env.MAX_VIDEO_SIZE_MB) * 1024 * 1024,
    maxSizeAllowedFree: Number(process.env.MAX_SIZE_ALLOWED_FREE) || 15,
    maxImageSize: Number(process.env.MAX_IMAGE_SIZE) || 5, // 5MB
  },
};

module.exports = serverConfig;
