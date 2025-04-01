import axios from "axios";
import * as utils from "../utils";

//Login
export const login = async (email, password) => {
  try {
    const res = await axios.post(
      utils.API_URL.LOGIN_URL,
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
    console.error(
      "Login error:",
      error.response?.data?.message || error.message
    );
    return null;
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
export const getInfocheckAuth = async (idToken, localId) => {
  try {
    if (!idToken) {
      throw new Error("Thiếu idToken! Vui lòng đăng nhập lại.");
    }

    const res = await axios.post(utils.API_URL.CHECK_AUTH_URL, {
      idToken,
      localId,
    });

    return res.status; // Chỉ trả về status
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra xác thực:", error);

    if (error.response) {
      throw new Error(error.response.status); // Quăng lỗi với mã trạng thái từ server
    } else if (error.request) {
      throw new Error("503"); // Lỗi kết nối, giả định mã 503 (Service Unavailable)
    } else {
      throw new Error("500"); // Lỗi không xác định, giả định mã 500
    }
  }
};

export const getInfo = async (idToken, localId) => {
  try {
    if (!idToken) {
      throw new Error("Thiếu idToken! Vui lòng đăng nhập lại.");
    }

    const res = await axios.post(utils.API_URL.GET_INFO_URL, {
      idToken,
      localId,
    });

    if (!res.data || !res.data.user) {
      throw new Error("Dữ liệu trả về không hợp lệ!");
    }

    return res.data.user;
  } catch (error) {
    let errorMessage = "Lỗi không xác định!";

    if (error.response) {
      // Lỗi từ server
      errorMessage = error.response.data?.message || "Lỗi từ server!";
    } else if (error.request) {
      // Lỗi kết nối (không nhận được phản hồi)
      errorMessage = "Không thể kết nối đến server! Kiểm tra mạng của bạn.";
    } else {
      // Lỗi khác
      errorMessage = error.message;
    }

    console.error("❌ Lỗi khi lấy thông tin người dùng:", errorMessage);
    throw new Error(errorMessage); // Quăng lỗi để xử lý trong component
  }
};
//Get Momemnt
export const getLatestMoment = async (idToken) => {
  try {
    const res = await axios.post(
      utils.API_URL.GET_LASTEST_URL,
      { idToken },
      { withCredentials: true }
    );

    console.log("Moment mới nhất:", res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy moment:", error.response?.data || error.message);
    throw error; // Quăng lỗi để xử lý trong component
  }
};
export const uploadMedia = async (formData, setUploadProgress) => {
  let timeOutId;

  try {
    const fileType = formData.get("images") ? "image" : "video";

    // Thời gian chờ tùy vào loại file
    timeOutId = setTimeout(
      () => {
        console.log("⏳ Uploading is taking longer than expected...");
      },
      fileType === "image" ? 5000 : 15000
    );

    const response = await axios.post(
      utils.API_URL.UPLOAD_MEDIA_URL,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (setUploadProgress && typeof setUploadProgress === "function") {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            // Giảm tốc độ cập nhật progress
            if (percent > currentProgress) {
              const updateProgress = (target) => {
                if (currentProgress < target) {
                  currentProgress += 1;
                  setUploadProgress(currentProgress);
                  setTimeout(() => updateProgress(target), 50); // Điều chỉnh tốc độ
                }
              };
              updateProgress(percent);
            }
          }
        },
      }
    );

    clearTimeout(timeOutId);

    console.log("✅ Upload thành công:", response.data);
    return response.data;
  } catch (error) {
    clearTimeout(timeOutId);
    console.error("❌ Lỗi khi upload:", error.response?.data || error.message);
    throw error;
  }
};
