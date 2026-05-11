const CACHE_KEY = "weather_cache_v2";
const CACHE_DURATION = 10 * 60 * 1000;

export const getCachedWeather = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);

    if (!cached) return null;

    const parsed = JSON.parse(cached);

    const isValid =
      Date.now() - parsed.timestamp < CACHE_DURATION;

    return isValid ? parsed.data : null;
  } catch {
    return null;
  }
};

export const setCachedWeather = (data) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    }),
  );
};