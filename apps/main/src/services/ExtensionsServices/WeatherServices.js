import { instanceMain } from "@/libs";
import axios from "axios";

export const getInfoWeather = async ({ lat, lon }) => {
  if (!lat || !lon) {
    console.warn("⚠️ Thieu lat or lon");
    return null;
  }

  try {
    const res = await instanceMain.post("/api/weatherV3", { lat, lon });

    if (res?.data?.status === "success") {
      return res.data.data;
    }

    console.error("❌ getInfoWeather: Không có dữ liệu hợp lệ", res?.data);
    return null;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi getInfoWeather:", error.message);
    return null;
  }
};

export const getInfoWeatherV1 = async ({ lat, lon }) => {
  if (!lat || !lon) {
    console.warn("⚠️ Thieu lat or lon");
    return null;
  }

  try {
    const res = await instanceMain.post("/api/weatherV2", { lat, lon });

    if (res?.data?.status === "success") {
      return res.data.data;
    }

    console.error("❌ getInfoWeather: Không có dữ liệu hợp lệ", res?.data);
    return null;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi getInfoWeather:", error.message);
    return null;
  }
};

export const getTwilightInfo = async ({ lat, lon }) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto&forecast_days=1`;

    const res = await axios.get(url);

    return {
      sunrise: new Date(res.data.daily.sunrise[0]),
      sunset: new Date(res.data.daily.sunset[0]),
    };
  } catch (error) {
    console.error("🚨 getTwilightInfo:", error.message);
    return null;
  }
};
