import axios from "axios";
import { API_URL } from "../API/apiRoutes";
import { saveToken } from "../storage";

export const refreshIdToken = async (refreshToken) => {
  try {
    const res = await axios.post(API_URL.REFESH_TOKEN_URL, {
      refreshToken,
    });

    const updatedTokens = {
      idToken: res?.data?.data?.id_token,
      refreshToken: res?.data?.refresh_token || refreshToken,
      localId: res?.data?.data?.user_id,
    };

    console.log("🔄 Token được làm mới:", updatedTokens);

    saveToken(updatedTokens); // lưu theo rememberMe đã có
    
    return updatedTokens; // ✅ Trả về để useEffect nhận
  } catch (err) {
    console.error("Lỗi khi refresh token từ server:", err);
    throw err;
  }
};

