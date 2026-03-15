const fs = require("fs");
const { instanceLocketV2 } = require("../../libs");
const { logInfo, logError, logBanner } = require("../../utils/logEventUtils");
const {
  uploadThumbnailFromVideo,
  uploadVideoToFirebaseStorage,
} = require("../FirestorageService");
const { creVideoPayload } = require("../LocketPayload");

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
      case "custome":
        postData = creVideoPayload.videoPostPayloadCustome({
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

module.exports = {
  postVideoToLocket,
};
