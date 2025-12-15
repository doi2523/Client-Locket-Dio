import api from "@/lib/axios";
import { instanceMain } from "@/lib/axios.main";
import { CONFIG } from "@/config";

//Login
export const loginV2 = async ({ email, password, captchaToken }) => {
  try {
    const res = await instanceMain.post("locket/loginV2", {
      email,
      password,
      captchaToken,
    });

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
    const res = await instanceMain.post(
      "locket/refresh-token",
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

export const forgotPassword = async (email) => {
  try {
    const body = { email };

    const res = await instanceMain.post("locket/resetPassword", body);

    return res.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message || "Yêu cầu thất bại!");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      console.error("❌ Network Error:", error.message);
      throw new Error(
        "Có sự cố khi kết nối đến hệ thống, vui lòng thử lại sau ít phút."
      );
    }
  }
};

//Logout
export const logout = async () => {
  try {
    const body = {
      author: CONFIG.app.name,
      client: CONFIG.app.clientVersion,
    };
    const response = await instanceMain.get("locket/logout", {});
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
