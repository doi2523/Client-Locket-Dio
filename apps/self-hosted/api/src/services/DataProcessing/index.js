const { deleteTempFile } = require("./cleanTempMedia");
const { deleteFileFromStorageR2 } = require("./deleteFileFromStorage");
const { downloadMediaOnStorage } = require("./downloadMedia");
const { thumbnailData } = require("./generateThumbnail");
const { processImageBuffer } = require("./processImageBuffer");
const { processVideoBuffer, generateThumbnail } = require("./processVideoBuffer");

module.exports = {
  downloadMediaOnStorage,
  thumbnailData,
  deleteTempFile,
  deleteFileFromStorageR2,
  processImageBuffer,
  processVideoBuffer,
  generateThumbnail,
};
