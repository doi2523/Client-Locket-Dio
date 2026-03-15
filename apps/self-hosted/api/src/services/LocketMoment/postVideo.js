const { instanceLocketV2 } = require("../../libs");
const { logInfo, logError } = require("../../utils/logEventUtils");
const {
  uploadThumbnailFromVideo,
  uploadVideoToFirebaseStorage,
} = require("../FirestorageService");
const { createAnalytics } = require("../LocketAnalytics");

const postVideo = async (userId, idToken, video, caption) => {
  try {
    logInfo("postVideo", "Start");
    const videoAsBuffer = fs.readFileSync(video.path);
    const thumbnailUrl = await uploadThumbnailFromVideo(userId, idToken, video);

    if (!thumbnailUrl) {
      throw new Error("Failed to upload thumbnail");
    }

    const videoUrl = await uploadVideoToFirebaseStorage(
      userId,
      idToken,
      videoAsBuffer,
    );

    if (!videoUrl) {
      throw new Error("Failed to upload video");
    }

    await postVideoToLocket(idToken, videoUrl, thumbnailUrl, caption);

    logInfo("postVideo", "End");
  } catch (error) {
    logError("postVideo", error.message);
    throw error;
  } finally {
    fs.unlinkSync(video.path);
  }
};

const postVideoToLocket = async (idToken, videoUrl, thumbnailUrl, caption) => {
  try {
    const body = {
      data: {
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        md5: getMd5Hash(videoUrl),
        recipients: [],
        analytics: createAnalytics(),
        sent_to_all: true,
        caption: caption,
        overlays: [
          {
            data: {
              text: caption,
              text_color: "#FFFFFFE6",
              type: "standard",
              max_lines: {
                "@type": "type.googleapis.com/google.protobuf.Int64Value",
                value: "4",
              },
              background: {
                material_blur: "ultra_thin",
                colors: [],
              },
            },
            alt_text: caption,
            overlay_id: "caption:standard",
            overlay_type: "caption",
          },
        ],
      },
    };

    const response = await instanceLocketV2.post("postMomentV2", body, {
      meta: { idToken },
    });

    logInfo("postVideoToLocket", "End");

    return response;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.statusText ||
      error.message;
    logError("postVideoToLocket", message);
    throw error;
  }
};

module.exports = {
  postVideo,
};
