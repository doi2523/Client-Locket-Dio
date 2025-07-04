import axios from "axios";
import * as utils from "../../utils";

export const fetchUserPlan = async () => {
  const { localId } = utils.getToken() || {};
  try {
    const res = await fetch(`${utils.API_URL.GET_USER_PLANS}/${localId}`, {
      // headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) throw new Error("Không lấy được user plan");
    const data = await res.json();
    // Lưu vào localStorage để cache
    localStorage.setItem("userPlan", JSON.stringify(data));
    return data;
  } catch (e) {
    // Nếu lỗi, thử lấy từ cache localStorage
    const cached = localStorage.getItem("userPlan");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export const registerFreePlan = async (user) => {
  try {
    const res = await fetch(utils.API_URL.REGISTER_USER_PLANS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        uid: user.localId,
        username: user.username || user.email || "user",
        email: user.email,
        display_name: user.displayName || user.email,
        profile_picture: user.profilePicture || "",
      }),
    });
    if (!res.ok) throw new Error("Đăng ký gói Free thất bại");
    const data = await res.json();
    localStorage.setItem("userPlan", JSON.stringify(data.data));
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
export const getUserUploadStats = async () => {
  const { localId } = utils.getToken() || {};
  try {
    const response = await axios.post(
      utils.API_URL.GET_UPLOAD_STATS_URL,
      { localId }, // gửi uid trong body JSON
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    throw error;
  }
};
