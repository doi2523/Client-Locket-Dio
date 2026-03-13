import api from "@/lib/axios";

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
