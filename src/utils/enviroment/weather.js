import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../API/apiRoutes";

const CACHE_KEY = "weather_cache";
const CACHE_DURATION = 10 * 60 * 1000; // 2 phút

export function useLocationWeather() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const now = Date.now();

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < CACHE_DURATION) {
          setLocation(parsed.location);
          setWeather(parsed.weather);
          return; // Dừng luôn, không gọi API nữa
        }
      } catch (e) {
        console.warn("Lỗi parse weather cache:", e);
      }
    }

    // Nếu cache hết hạn thì lấy lại vị trí và gọi API
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await axios.post(API_URL.GET_WEATHER_URL_V2, {
            lat: latitude,
            lon: longitude,
          });          

          const data = res?.data?.data;

          if (data) {
            setLocation(data.location);
            setWeather(data.current);

            // Cache lại kết quả
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                timestamp: now,
                location: data.location,
                weather: data.current,
              })
            );
          }
        } catch (error) {
          console.error("Lỗi khi gọi API thời tiết:", error);
        }
      },
      (err) => {
        console.error("Lỗi lấy vị trí:", err);
      }
    );
  }, []);

  return { location, weather };
}
