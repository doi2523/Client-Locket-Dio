const { uploadImageToFirebaseStorage } = require("./uploadImage.js");
const {
  uploadVideoToFirebaseStorage,
  uploadThumbnailFromVideo,
} = require("./uploadVideo.js");

module.exports = {
  uploadImageToFirebaseStorage,
  uploadVideoToFirebaseStorage,
  uploadThumbnailFromVideo,
};
