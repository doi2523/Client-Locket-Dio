import axios from "axios";
import { API_URL } from "../API/apiRoutes";

export const refreshIdToken = async (refreshToken) => {
  try {
    const res = await axios.post(API_URL.REFESH_TOKEN_URL, {
      refreshToken,
    });
    console.log(res);
    
    const updatedTokens = {
      idToken: res?.data?.id_token,
      refreshToken: res?.data?.refresh_token || refreshToken,
    };
    utils.saveToken(updatedTokens);
    //return res.data; // { idToken, expiresIn, refreshToken }
  } catch (err) {
    console.error("Lỗi khi refresh token từ server:", err);
    throw err;
  }
};
