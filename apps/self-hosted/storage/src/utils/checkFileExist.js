const { s3, HeadObjectCommand } = require("../../config/r2-storage");
const constants = require("../constants/storageConfig");

/**
 * Kiểm tra file đã tồn tại trong bucket chưa
 * @param {string} key - đường dẫn file (ví dụ: LocketCloud/2025-09-27/image/test.png)
 * @returns {boolean}
 */
async function checkFileExists(key) {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: constants.BUCKET_NAME,
        Key: key,
      })
    );
    return true; // file tồn tại
  } catch (err) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return false; // file không tồn tại
    }
    throw err; // lỗi khác (quyền, kết nối...)
  }
}

module.exports = { checkFileExists };
