import axios from "axios";

export const refreshIdToken = async (refreshToken) => {
  try {
    const res = await axios.post("http://localhost:5004/locket/refresh-token", {
      refreshToken,
    });
    return res.data; // { idToken, expiresIn, refreshToken }
  } catch (err) {
    console.error("Lỗi khi refresh token từ server:", err);
    throw err;
  }
};
