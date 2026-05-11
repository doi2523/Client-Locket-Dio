import { useState, useEffect } from "react";
import { getCachedWeather, setCachedWeather } from "../utils/weatherCache";
import { getInfoWeather, getInfoWeatherV1, getTwilightInfo } from "@/services";
import { transformWeatherToOverlay } from "../utils/weatherUtils";

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

export function useCurrentWeatherV2() {
  const [weatherInfo, setWeatherInfo] = useState(DEFAULT_WEATHER);

  useEffect(() => {
    const cached = getCachedWeather();

    if (cached) {
      setWeatherInfo(cached);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const [weatherData, twilightData] = await Promise.all([
            getInfoWeatherV1({
              lat: latitude,
              lon: longitude,
            }),
            getTwilightInfo({
              lat: latitude,
              lon: longitude,
            }),
          ]);

          if (!weatherData || !twilightData) return;

          const result = await transformWeatherToOverlay(
            weatherData,
            twilightData,
          );

          if (!result) return;

          setWeatherInfo(result);
          setCachedWeather(result);
        } catch {}
      },
      () => {},
    );
  }, []);

  return weatherInfo;
}
