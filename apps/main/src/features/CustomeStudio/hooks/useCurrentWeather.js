import { useState, useEffect } from "react";
import { getInfoWeather } from "@/services";

const CACHE_KEY = "weather_cache_v2";
const CACHE_DURATION = 2 * 60 * 1000; // 2 phút

const DEFAULT_WEATHER = {
  text: null,
  caption: null,
  icon: {
    color: "#ffca1f",
    data: "sun.max.fill",
    type: "sf_symbol",
  },
  background: {
    colors: ["#4facfe", "#00f2fe"],
  },
};

export function useCurrentWeather() {
  const [weatherInfo, setWeatherInfo] = useState(DEFAULT_WEATHER);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const now = Date.now();

    if (cached) {
      try {
        const parsed = JSON.parse(cached);

        if (now - parsed.timestamp < CACHE_DURATION) {
          setWeatherInfo(parsed.data);
          return;
        }
      } catch {}
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const result = await getInfoWeather({
            lat: latitude,
            lon: longitude,
          });

          if (!result) return;

          // ✅ API đã trả đúng format → dùng luôn
          setWeatherInfo(result);

          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data: result,
              timestamp: Date.now(),
            }),
          );
        } catch {}
      },
      () => {
        // giữ fallback
      },
    );
  }, []);

  return weatherInfo;
}
