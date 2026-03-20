import api from "@/lib/axios";

export const GetAllMoments = async ({ timestamp = null, friendId = null, limit = 60}) => {
  try {
    const res = await api.post("/locket/getMomentV2", {
      timestamp: timestamp,
      friendId: friendId,
      limit: limit,
    });
    return res.data?.data;
  } catch (err) {
    console.warn("Failed", err);
  }
};

export const GetInfoMoment = async (idMoment) => {
  try {
    const res = await api.post("/locket/getInfoMomentV2", {
      pageToken: null,
      idMoment,
      limit: null,
    });
    const moments = res.data.data;
    return moments;
  } catch (err) {
    console.warn("❌ React Failed", err);
  }
};
