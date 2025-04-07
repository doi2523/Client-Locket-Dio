import { getAuthCookies } from "./cookieUtils";

export const createRequestPayload = (mediaInfo, caption, selectedColors) => {
  // Tạo đối tượng token (bao gồm idToken và localId)
  const tokenData = {
    idToken: getAuthCookies().idToken,
    localId: getAuthCookies().localId,
  };

  // Tạo đối tượng options (bao gồm các lựa chọn như caption, colors...)
  const optionsData = {
    caption: caption,
    text_color: "#FFFFFF",
    colorTop: selectedColors.top,
    colorBottom: selectedColors.bottom,
  };

  // Tạo đối tượng payload chứa tất cả dữ liệu cần gửi
  const payload = {
    userData: tokenData,
    options: optionsData,
    model: "uploadmediaV2",
    mediaInfo: mediaInfo,
  };

  return payload;
};
