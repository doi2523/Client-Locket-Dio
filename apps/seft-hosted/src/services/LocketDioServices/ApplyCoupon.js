import { instanceMain } from "@/lib/axios.main";

const reasonMessages = {
  NOT_FOUND: "Mã giảm giá không tồn tại",
  DISABLED: "Mã giảm giá đã bị vô hiệu hóa",
  EXPIRED: "Mã giảm giá đã hết hạn",
  PLAN_NOT_ALLOWED: "Mã giảm giá không áp dụng cho gói này",
  AUTH_REQUIRED: "Vui lòng đăng nhập để sử dụng mã",
  LIMIT_REACHED: "Mã giảm giá đã đạt giới hạn sử dụng",
  USER_LIMIT: "Bạn đã sử dụng mã này quá số lần cho phép",
  NOT_ENOUGH_SUBTOTAL: "Giá trị đơn hàng chưa đủ để áp dụng mã"
};

const handleCouponResponse = (data) => {
  if (!data.valid) {
    return {
      valid: false,
      message: reasonMessages[data.reason] || "Lỗi khi áp dụng mã"
    };
  } else {
    return {
      valid: true,
      discount_amount: data.discount_amount,
      total: data.total,
      message: "Áp dụng mã thành công"
    };
  }
};

export const CheckCoupon = async (code, planId) => {
  try {
    const res = await instanceMain.post("api/coupon/validate", {
      code,
      planId,
    });
    return handleCouponResponse(res?.data);
  } catch (error) {
    console.error("Lỗi khi kiểm tra coupon:", error);
    return {
      valid: false,
      message: "Không thể kiểm tra mã giảm giá"
    };
  }
};
