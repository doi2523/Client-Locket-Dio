import { instanceLocketV2 } from "@/lib/axios.locket";

export const ValidateEmailAddress = async (email) => {
  try {
    const body = {
      data: {
        email: email,
        operation: "sign_in",
        platform: "ios",
      },
    };
    const res = await instanceLocketV2.post("validateEmailAddress", body);
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
