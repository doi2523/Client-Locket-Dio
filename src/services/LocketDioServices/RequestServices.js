import api from "@/lib/axios";

export const SendRequestToCelebrity = async (uid) => {
  try {
    const response = await api.post("/locket/sendCelebrityRequestV2", {
      friendUid: uid,
    });
    return response?.data;
  } catch (error) {
    console.error("❌ Lỗi khi tìm bạn:", error.response?.data || error.message);
    throw error;
  }
};
