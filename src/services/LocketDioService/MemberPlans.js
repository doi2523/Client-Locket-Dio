import axios from "axios";
import * as utils from "../../utils";
import api from "../../lib/axios";

export const fetchUserPlan = async () => {
  try {
    const res = await api.get("/api/me");
    const userPlan = res?.data?.data;

    // Lưu vào cache nếu muốn
    // if (userPlan) {
    //   localStorage.setItem("userPlan", JSON.stringify(userPlan));
    // }

    return userPlan;
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
const LAST_UPDATE_KEY = "lastUserUpdate";
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 giờ

export const updateUserInfo = async (user) => {
  const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
  const now = Date.now();

  // Nếu đã cập nhật trong vòng 24h thì bỏ qua
  if (lastUpdate && now - parseInt(lastUpdate) < UPDATE_INTERVAL) return;

  try {
    const payload = {
      uid: user?.localId,
      username: user?.username || user?.email || "user",
      email: user?.email,
      display_name: user?.displayName || user?.email,
      profile_picture: user?.photoURL || user?.profilePicture || "",
    };

    await api.post("/api/u", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    localStorage.setItem(LAST_UPDATE_KEY, now.toString());
    console.log("✅ User info updated");
  } catch (err) {
    console.error("❌ Failed to update user info:", err);
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
    localStorage.setItem("uploadStats", JSON.stringify(response?.data?.data));

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await api.get("/api/m");
    localStorage.setItem("uploadStats", JSON.stringify(response?.data?.data));

    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    throw error;
  }
};

export const GetListInfoPlans = async () => {
  try {
    const response = await axios.get(utils.API_URL.GET_DIO_PLANS);

    return response.data;
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    throw error;
  }
};