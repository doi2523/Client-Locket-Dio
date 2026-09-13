const { instanceLocketV2 } = require("../../libs");
const { logInfo, logError, logBanner } = require("../../utils/logEventUtils");
const { uploadImageToFirebaseStorage } = require("../FirestorageService");
const { creImagePayload } = require("../LocketPayload");

const postImageToLocket = async ({ userId, idToken, image, optionsData }) => {
  try {
    logInfo("postImage", "Start");

    if (!optionsData || !optionsData.type) {
      throw new Error("Missing optionsData.type");
    }

    const imageUrl = await uploadImageToFirebaseStorage(userId, idToken, image);

    const { type } = optionsData;

    logBanner(`Type đang sử dụng: ${type}`);

    let postData;

    switch (type) {
      // caption mặc định
      case "default":
        postData = creImagePayload.imagePostPayloadDefault({
          imageUrl,
          optionsData,
        });
        break;

      // decorative của Locket
      case "decorative":
        postData = creImagePayload.imagePostPayloadDecorative({
          imageUrl,
          optionsData,
        });
        break;

      // custom của Dio
      case "image_icon":
      case "image_gif":
      case "caption_icon":
      case "caption_gif":
      case "custome":
        postData = creImagePayload.imagePostPayloadCustome({
          imageUrl,
          optionsData,
        });
        break;

      default:
        throw new Error(`Không hỗ trợ type: ${type}`);
    }

    const postResponse = await instanceLocketV2.post("postMomentV2", postData, {
      meta: { idToken },
    });

    logInfo("postImage", "End");

    return postResponse.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.statusText ||
      error.message;

    logError("postImage", message);

    throw new Error(message);
  }
};

const postImageToLocketV2 = async ({
  userId,
  idToken,
  imageBuffer,
  optionsData,
}) => {
  try {
    logInfo("postImage", "Start");

    if (!optionsData || !optionsData.type) {
      throw new Error("Missing optionsData.type");
    }

    const imageUrl = await uploadImageToFirebaseStorage(
      userId,
      idToken,
      imageBuffer,
    );

    const { type } = optionsData;

    logBanner(`Type đang sử dụng: ${type}`);

    let postData;

    switch (type) {
      // caption mặc định
      case "default":
        postData = creImagePayload.imagePostPayloadDefault({
          imageUrl,
          optionsData,
        });
        break;

      // decorative của Locket
      case "decorative":
        postData = creImagePayload.imagePostPayloadDecorative({
          imageUrl,
          optionsData,
        });
        break;

      // custom của Dio
      case "image_icon":
      case "image_gif":
      case "caption_icon":
      case "caption_gif":
        postData = creImagePayload.imagePostPayloadIcon({
          imageUrl,
          optionsData,
        });
        break;

      default:
        throw new Error(`Không hỗ trợ type: ${type}`);
    }

    const postResponse = await instanceLocketV2.post("postMomentV2", postData, {
      meta: { idToken },
    });

    logInfo("postImage", "End");

    return postResponse.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.statusText ||
      error.message;

    logError("postImage", message);

    throw new Error(message);
  }
};

module.exports = {
  postImageToLocket,
  postImageToLocketV2,
};
