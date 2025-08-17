import api from "@/lib/axios";

export const GetAllMessage = async (
  nextPageToken = null,
  initialLimit = 20
) => {
  try {
    const res = await api.post("/locket/getAllMessageV2", {
      pageToken: nextPageToken,
      limit: initialLimit,
    });
    return res.data;
  } catch (err) {
    console.warn("❌ React Failed", err);
  }
};

export const getMessagesWithUser = async (
  userUid,              // 👈 uid của người cần lấy message
  nextPageToken = null,
  initialLimit = 20
) => {
  try {
    const res = await api.post("/locket/getMessageWithUserV2", {
      withUser: userUid,
      pageToken: nextPageToken,
      limit: initialLimit,
    });
    return res.data;
  } catch (err) {
    console.warn("❌ React Failed", err);
    return null;
  }
};

