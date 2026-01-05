import { BETA_SERVER_HOST } from "@/config/apiConfig";
import api from "@/lib/axios";
import { instanceLocketV2 } from "@/lib/axios.locket";
import { instanceMain } from "@/lib/axios.main";
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

export const loginWithPhone = async ({ phone, password, captchaToken }) => {
  try {
    const body = {
      data: {
        phone: phone,
        password: password,
        analytics: {
          ios_version: "2.8.0.1",
          amplitude: {
            device_id: "75D0035E-9C8E-4704-B02D-96976A512DD7",
            session_id: {
              value: "1766294565599",
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
            },
          },
          experiments: {
            flag_8: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "500",
            },
            flag_10: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "505",
            },
            flag_22: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "1203",
            },
            flag_9: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "11",
            },
            flag_3: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "600",
            },
            flag_6: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "2000",
            },
            flag_18: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "1203",
            },
            flag_4: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "43",
            },
            flag_7: {
              value: "800",
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
            },
            flag_15: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "501",
            },
            flag_14: {
              value: "502",
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
            },
          },
          google_analytics: {
            app_instance_id: "01AD606783C24E3C86AD6A12375E565B",
          },
          platform: "ios",
        },
      },
    };
    const res = await instanceLocketV2.post("signInWithPhonePassword", body);
    // Kiểm tra nếu API trả về lỗi nhưng vẫn có status 200
    if (res.data?.result.status === 400) {
      console.error("Login failed:", res.data.message);
      return null;
    }
    const result = await instanceMain.post("locket/getInfoUser", {
      token: res.data.result.token,
    });

    return result.data; // Trả về dữ liệu từ server
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

export const sendVerifiCode = async ({ phone }) => {
  try {
    const body = {
      data: {
        phone: phone,
        operation: "sign_in",
        platform: "ios",
        is_retry: false,
        use_password_if_available: true,
        client_token: "0de0a23710ad3964c317e7a727977d5ca6ff9fc7",
        analytics: {
          ios_version: "2.8.0.1",
          amplitude: {
            device_id: "75D0035E-9C8E-4704-B02D-96976A512DD7",
            session_id: {
              value: "1766294565599",
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
            },
          },
          experiments: {
            flag_8: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "500",
            },
            flag_10: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "505",
            },
            flag_22: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "1203",
            },
            flag_9: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "11",
            },
            flag_3: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "600",
            },
            flag_6: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "2000",
            },
            flag_18: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "1203",
            },
            flag_4: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "43",
            },
            flag_7: {
              value: "800",
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
            },
            flag_15: {
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
              value: "501",
            },
            flag_14: {
              value: "502",
              "@type": "type.googleapis.com/google.protobuf.Int64Value",
            },
          },
          google_analytics: {
            app_instance_id: "01AD606783C24E3C86AD6A12375E565B",
          },
          platform: "ios",
        },
      },
    };
    const res = await instanceLocketV2.post("sendVerificationCode", body);
    console.log("loginWithPhone response:", res);
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

    const res = await instanceMain.post(
      `${BETA_SERVER_HOST}/locket/resetPassword`,
      body
    );

    return res.data;
  } catch (error) {
    console.log(error);

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
