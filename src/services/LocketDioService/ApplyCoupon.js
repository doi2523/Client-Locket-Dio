import api from "../../lib/axios";

export const CheckCoupon = async (code, planId) => {
  const res = await api.post("api/coupons/check", {
    code,
    planId,
  });

  return res?.data?.data;
};
