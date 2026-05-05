import api from "@/libs/axios";
import { getPushSubscription } from "../BrowserServices";
import { instanceAuth } from "@/libs";

export const updateUserInfo = async (user) => {
  try {
    const body = {
      uid: user?.localId,
      username: user?.username || user?.email || "user",
      email: user?.email,
      display_name: user?.displayName || user?.email,
      profile_picture: user?.photoURL || user?.profilePicture || "",
    };

    await instanceAuth.post("/api/u", body);
  } catch (err) {
    console.error("❌ Failed to update user info:", err);
  }
};

export const GetUserData = async () => {
  try {
    const res = await api.get("/api/me");
    return res.data?.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy thông tin người dùng:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error.message;
  }
};

export const GetUserDataV2 = async () => {
  try {
    const res = await api.get("/api/cn");
    return res.data?.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy thông tin người dùng:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error.message;
  }
};

export const GetInfoFamily = async () => {
  try {
    const res = await api.get("/api/getInfoFamily");
    return res.data?.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy thông tin người dùng:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error.message;
  }
};

export const syncPushSubscription = async () => {
  try {
    const sub = await getPushSubscription();
    if (!sub) return;

    const body = {
      app: "locketdio",
      type: "webpush",
      data: sub,
    };

    await instanceAuth.post("/api/setNotificationToken", body);
  } catch (err) {
    console.error("Push sync error:", err);
  }
};
