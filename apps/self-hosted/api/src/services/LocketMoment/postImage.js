const { instanceLocketV2 } = require("../../libs");
const { logInfo, logError } = require("../../utils/logEventUtils");
const { uploadImageToFirebaseStorage } = require("../firestorageService");

const postImage = async (userId, idToken, image, caption) => {
  try {
    logInfo("postImage", "Start");
    const imageUrl = await uploadImageToFirebaseStorage(userId, idToken, image);

    const body = {
      data: {
        thumbnail_url: imageUrl,
        caption: caption,
        sent_to_all: true,
      },
    };

    const postResponse = await instanceLocketV2.post("postMomentV2", body, {
      meta: { idToken },
    });

    logInfo("postImage", "End");
    return postResponse;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.statusText ||
      error.message;
    logError("postImage", message);
    throw error;
  }
};

module.exports = {
  postImage,
};
