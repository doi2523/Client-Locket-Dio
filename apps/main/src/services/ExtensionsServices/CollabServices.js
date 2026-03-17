import axios from "axios";

export const getCollabCaption = async (captionId) => {
  try {
    const res = await axios.post("https://api.captionkanade.chisadin.site/api/get_captions_id_V2", {
      id: captionId,
    });
    return res.data?.caption || null;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};
