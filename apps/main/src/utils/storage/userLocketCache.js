import { CACHE_CONFIG } from "@/config";

const CACHE_KEY = CACHE_CONFIG.keys.user;
const CACHE_DURATION_MS = CACHE_CONFIG.ttls.user;

export const saveUserCache = (user) => {
  const now = Date.now();
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data: user, timestamp: now })
  );
};

export const getUserCache = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    const now = Date.now();

    if (now - parsed.timestamp < CACHE_DURATION_MS) {
      return parsed.data;
    }

    return null;
  } catch {
    return null;
  }
};

export const clearUserCache = () => {
  localStorage.removeItem(CACHE_KEY);
};