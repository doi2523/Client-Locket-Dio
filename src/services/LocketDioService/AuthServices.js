import axios from "axios";
import * as utils from "../../utils";
import api from "../../lib/axios";

//Login
export const login = async (email, password) => {
  try {
    const res = await axios.post(
      utils.API_URL.LOGIN_URL_V2,
      { email, password },
      { withCredentials: true } // Nhận cookie từ server
    );

    // Kiểm tra nếu API trả về lỗi nhưng vẫn có status 200
    if (res.data?.success === false) {
      console.error("Login failed:", res.data.message);
      return null;
    }

    return res.data; // Trả về dữ liệu từ server
  } catch (error) {
    if (error.response && error.response.data?.error) {
      throw error.response.data.error; // ⬅️ Ném lỗi từ `error.response.data.error`
    }
    console.error("❌ Network Error:", error.message);
    throw new Error(
      "Có sự cố khi kết nối đến hệ thống, vui lòng thử lại sau ít phút."
    );
  }
};
export const loginV2 = async (email, password) => {
  try {
    const res = await api.post(
      utils.API_URL.LOGIN_URL_V2,
      { email, password }
    );

    // Kiểm tra nếu API trả về lỗi nhưng vẫn có status 200
    if (res.data?.success === false) {
      console.error("Login failed:", res.data.message);
      return null;
    }

    return res.data; // Trả về dữ liệu từ server
  } catch (error) {
    if (error.response && error.response.data?.error) {
      throw error.response.data.error; // ⬅️ Ném lỗi từ `error.response.data.error`
    }
    console.error("❌ Network Error:", error.message);
    throw new Error(
      "Có sự cố khi kết nối đến hệ thống, vui lòng thử lại sau ít phút."
    );
  }
};
export const refreshIdToken = async (refreshToken) => {
  try {
    const res = await axios.post(
      utils.API_URL.REFESH_TOKEN_URL,
      { refreshToken },
      { withCredentials: true } // Nhận cookie từ server
    );
    // Kiểm tra nếu API trả về lỗi nhưng vẫn có status 200
    // if (res.data?.success === false) {
    //   console.error("Login failed:", res.data.message);
    //   return null;
    // }

    return res.data.idToken; // Trả về dữ liệu từ server
  } catch (error) {
    if (error.response && error.response.data?.error) {
      throw error.response.data.error; // ⬅️ Ném lỗi từ `error.response.data.error`
    }
    console.error("❌ Network Error:", error.message);
    throw new Error(
      "Có sự cố khi kết nối đến hệ thống, vui lòng thử lại sau ít phút."
    );
  }
};
//Logout
export const logout = async () => {
  try {
    const response = await axios.get(utils.API_URL.LOGOUT_URL, {
      withCredentials: true,
    });
    return response.data; // ✅ Trả về dữ liệu từ API (ví dụ: { message: "Đã đăng xuất!" })
  } catch (error) {
    console.error(
      "❌ Lỗi khi đăng xuất:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message; // ✅ Trả về lỗi nếu có
  }
};

export const GetUserData = async () => {
  try {
    const res = await api.get("/api/me");
    return res.data?.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy thông tin người dùng:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

