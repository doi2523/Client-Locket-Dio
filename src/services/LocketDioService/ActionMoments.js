import api from "../../lib/axios";

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
    console.log("✅ React Done, moments:", moments);
    return moments;
  } catch (err) {
    console.warn("❌ React Failed", err);
  }
};
