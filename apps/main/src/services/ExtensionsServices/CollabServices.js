import axios from "axios";

const BASE_URL = "https://api.captionkanade.site";
export const getCollabCaption = async (captionId) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/get_captions_id_V2`, {
      id: captionId,
    });
    return res.data?.caption || null;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};
