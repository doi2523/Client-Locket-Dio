import { instanceMain } from "@/lib/axios.main";

export const getCollabCaption = async (captionId) => {
  try {
    const res = await instanceMain.post("/api/collab/getCaption", {
      id: captionId,
    });
    return res.data?.data || null;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};
