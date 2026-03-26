import api from "@/libs/axios";

export const uploadMediaV2 = async (payload) => {
  try {
    // Lấy mediaInfo từ payload
    const { mediaInfo } = payload;
    // Lấy type từ mediaInfo để xác định là ảnh hay video
    const fileType = mediaInfo.type;

    // Đặt timeout tùy theo loại tệp (ảnh hoặc video)
    const timeoutDuration =
      fileType === "image" ? 5000 : fileType === "video" ? 10000 : 5000;
    const timeoutId = setTimeout(() => {
      console.log("⏳ Uploading is taking longer than expected...");
    }, timeoutDuration);

    const response = await api.post("/locket/postMomentV2", payload);

    clearTimeout(timeoutId); // Hủy timeout khi upload thành công
    console.log("✅ Upload thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi upload:", error.response?.data || error.message);

    if (error.response) {
      console.error("📡 Server Error:", error.response);
    } else {
      console.error("🌐 Network Error:", error.message);
    }

    throw error;
  }
};
export const PostMoments = async (payload) => {
  try {
    // Lấy mediaInfo từ payload
    const { mediaInfo } = payload;
    // Lấy type từ mediaInfo để xác định là ảnh hay video
    const fileType = mediaInfo.type;

    // Đặt timeout tùy theo loại tệp (ảnh hoặc video)
    const timeoutDuration =
      fileType === "image" ? 10000 : fileType === "video" ? 15000 : 5000;
    const timeoutId = setTimeout(() => {
      console.log("⏳ Uploading is taking longer than expected...");
    }, timeoutDuration);

    const response = await api.post("/locket/postMomentV2", payload);

    clearTimeout(timeoutId); // Hủy timeout khi upload thành công
    console.log("✅ Upload thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi upload:", error.response?.data || error.message);

    if (error.response) {
      console.error("📡 Server Error:", error.response);
    } else {
      console.error("🌐 Network Error:", error.message);
    }

    throw error;
  }
};
