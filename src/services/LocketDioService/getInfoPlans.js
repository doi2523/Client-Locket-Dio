import * as utils from "../../utils";

export const fetchUserPlan = async () => {
  // Đợi lấy token & uid
  const auth = await utils.getCurrentUserTokenAndUid();

  if (!auth) {
    console.error("Không lấy được token và uid hiện tại.");
    return [];
  }

  const { idToken, localId, refreshToken } = auth;

  try {
    const res = await fetch(`${utils.API_URL.GET_USER_PLANS}/${localId}`, {
      headers: { Authorization: `Bearer ${idToken}` },
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

export const registerFreePlan = async (user, idToken) => {
  try {
    const res = await fetch(utils.API_URL.REGISTER_USER_PLANS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
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
