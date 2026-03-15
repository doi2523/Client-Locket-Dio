const crypto = require("crypto");
const { logInfo } = require("../../utils/logEventUtils");
const { createAnalytics } = require("../LocketAnalytics");
const { getYYYYMMDD } = require("../../utils/formatDay");

const getMd5Hash = (str) => {
  return crypto.createHash("md5").update(str).digest("hex");
};

const createIntValue = (value) => ({
  "@type": "type.googleapis.com/google.protobuf.Int64Value",
  value: value.toString(),
});

/**
 * Tạo payload cơ bản cho ảnh hoặc video
 */
const createBasePayload = ({
  mediaUrl,
  thumbnailUrl,
  optionsData,
  isVideo = false,
}) => {
  const { recipients, audience } = optionsData;
  
  logInfo("createBasePayload", "Bắt đầu khởi tạo payload");

  const payload = {
    thumbnail_url: thumbnailUrl || mediaUrl, // nếu ảnh thì chính là mediaUrl
    md5: getMd5Hash(mediaUrl),
    show_personally: false,
    analytics: createAnalytics(),
    overlays: [],
  };

  if (audience === "private") {
    payload.sent_to_self_only = true;
    payload.sent_to_all = false;
  } else {
    payload.sent_to_self_only = false;
    payload.sent_to_all = true;
    payload.recipients = Array.isArray(recipients)
      ? recipients
      : recipients
        ? [recipients]
        : [];
  }

  // Nếu là video thì thêm các trường riêng
  if (isVideo) {
    payload.video_url = mediaUrl;
  }

  logInfo("newStreakDate", "Nhận yêu cầu tạo chuỗi cho ngày", getYYYYMMDD());
  payload.update_streak_for_yyyymmdd = getYYYYMMDD();

  return payload;
};

/**
 * Tạo payload cho ảnh
 */
const createBaseImagePayload = ({ imageUrl, optionsData }) =>
  createBasePayload({ mediaUrl: imageUrl, optionsData, isVideo: false });

/**
 * Tạo payload cho video (sử dụng chung base)
 */
const createBaseVideoPayload = ({ videoUrl, thumbnailUrl, optionsData }) =>
  createBasePayload({
    mediaUrl: videoUrl,
    thumbnailUrl,
    optionsData,
    isVideo: true,
  });

module.exports = {
  createBasePayload,
  createBaseImagePayload,
  createBaseVideoPayload,
};
