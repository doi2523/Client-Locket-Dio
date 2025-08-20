import api from "@/lib/axios";

export const SendReactMoment = async (emoji, selectedMomentId, power) => {
  try {
    const res = await api.post("/locket/reactMomentV2", {
      reactionInfo: {
        emoji: emoji || "💛", // Thay bằng uid thực tế hoặc state
        moment_id: selectedMomentId, // Tuỳ nhu cầu
        intensity: power,
      },
    });
    const moments = res.data.data;
    return moments;
  } catch (err) {
    console.warn("❌ React Failed", err);
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

export const GetLastestMoment = async () => {
  try {
    const res = await api.get("/locket/getLatestMomentV2");
    const moments = res.data.data;
    return moments;
  } catch (err) {
    console.warn("❌ React Failed", err);
  }
};

export const SendMessageMoment = async (message, selectedMomentId, uid) => {
  try {
    const res = await api.post("/locket/sendMessageV2", {
      MessageInfo: {
        message: message || "💛",
        moment_id: selectedMomentId,
        receiver_uid: uid,
      },
    });
    const moments = res.data.data;
    return moments;
  } catch (err) {
    console.warn("❌ Failed", err);
  }
};

export const DeleteMoment = async (selectedMomentId) => {
  try {
    const res = await api.post("/locket/deleteMomentV2", {
      MomentInfo: {
        moment_id: selectedMomentId,
      },
    });
    const moments = res.data.data;
    return moments;
  } catch (err) {
    console.warn("❌ Failed", err);
  }
};
