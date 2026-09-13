import { checkAndRefreshToken } from "../utils";

export const getValidIdToken = async () => {
  return await checkAndRefreshToken(); // đơn giản hóa
};
