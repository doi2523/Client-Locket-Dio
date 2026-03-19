const fs = require("fs");
const { instanceLocketV2 } = require("../../libs");
const { logInfo, logError, logBanner } = require("../../utils/logEventUtils");
const { creVideoPayload } = require("../LocketPayload");
const {
  uploadThumbnailFromVideo,
  uploadVideoToFirebaseStorage,
  uploadImageToFirebaseStorage,
} = require("../FirestorageService");

const postVideoToLocket = async ({ userId, idToken, video, optionsData }) => {
  try {
    logInfo("postVideoToLocket", "Start");

    const videoBuffer = video.buffer || fs.readFileSync(video.path);

    const thumbnailUrl = await uploadThumbnailFromVideo(userId, idToken, video);

    if (!thumbnailUrl) {
      throw new Error("Failed to upload thumbnail");
    }

    const videoUrl = await uploadVideoToFirebaseStorage(
      userId,
      idToken,
      videoBuffer,
    );

    if (!videoUrl) {
      throw new Error("Failed to upload video");
    }

    const { type } = optionsData;

    logBanner(`Type đang sử dụng: ${type}`);

    let postData;

    switch (type) {
      case "default":
        postData = creVideoPayload.videoPostPayloadDefault({
          videoUrl,
          thumbnailUrl,
          optionsData,
        });
        break;

      case "decorative":
        postData = creVideoPayload.videoPostPayloadDecorative({
          videoUrl,
          thumbnailUrl,
          optionsData,
        });
        break;

      case "image_icon":
      case "image_gif":
      case "caption_icon":
      case "caption_gif":
        postData = creVideoPayload.videoPostPayloadIcon({
          videoUrl,
          thumbnailUrl,
          optionsData,
        });
        break;

      default:
        throw new Error(`Không hỗ trợ type: ${type}`);
    }

    const response = await instanceLocketV2.post("postMomentV2", postData, {
      meta: { idToken },
    });

    logInfo("postVideoToLocket", "End");

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.statusText ||
      error.message;

    logError("postVideoToLocket", message);
    throw new Error(message);
  } finally {
    if (video?.path && fs.existsSync(video.path)) {
      fs.unlinkSync(video.path);
    }
  }
};

const postVideoToLocketV2 = async ({
  userId,
  idToken,
  videoBuffer,
  thumbBuffer,
  optionsData,
}) => {
  try {
    logInfo("postVideoToLocket", "Start");

    const thumbnailUrl = await uploadImageToFirebaseStorage(
      userId,
      idToken,
      thumbBuffer,
    );

    if (!thumbnailUrl) {
      throw new Error("Failed to upload thumbnail");
    }

    const videoUrl = await uploadVideoToFirebaseStorage(
      userId,
      idToken,
      videoBuffer,
    );

    if (!videoUrl) {
      throw new Error("Failed to upload video");
    }

    const { type } = optionsData;

    logBanner(`Type đang sử dụng: ${type}`);

    let postData;

    switch (type) {
      case "default":
        postData = creVideoPayload.videoPostPayloadDefault({
          videoUrl,
          thumbnailUrl,
          optionsData,
        });
        break;

      case "decorative":
        postData = creVideoPayload.videoPostPayloadDecorative({
          videoUrl,
          thumbnailUrl,
          optionsData,
        });
        break;

      case "image_icon":
      case "image_gif":
      case "caption_icon":
      case "caption_gif":
        postData = creVideoPayload.videoPostPayloadIcon({
          videoUrl,
          thumbnailUrl,
          optionsData,
        });
        break;

      default:
        throw new Error(`Không hỗ trợ type: ${type}`);
    }

    const response = await instanceLocketV2.post("postMomentV2", postData, {
      meta: { idToken },
    });

    logInfo("postVideoToLocket", "End");

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.statusText ||
      error.message;

    logError("postVideoToLocket", message);
    throw new Error(message);
  }
};

module.exports = {
  postVideoToLocket,
  postVideoToLocketV2,
};
