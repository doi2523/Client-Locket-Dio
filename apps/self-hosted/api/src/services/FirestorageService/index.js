const { uploadImageToFirebaseStorage } = require("./uploadImage");
const {
  uploadVideoToFirebaseStorage,
  uploadThumbnailFromVideo,
} = require("./uploadVideo");

module.exports = {
  uploadImageToFirebaseStorage,
  uploadVideoToFirebaseStorage,
  uploadThumbnailFromVideo,
};
