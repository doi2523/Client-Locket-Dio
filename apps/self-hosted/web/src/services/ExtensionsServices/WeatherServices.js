import { instanceMain } from "@/lib/axios.main";

export const getInfoWeather = async ({lat, lon}) => {
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
