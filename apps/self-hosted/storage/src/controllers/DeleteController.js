const {
  s3,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require("../../config/r2-storage");
const constants = require("../constants/storageConfig");
const { logSuccess, logInfo } = require("../utils/logEventUtils");

exports.deleteFileFromR2 = async (req, res) => {
  const { key } = req.body; // key là đường dẫn file bên trong bucket (VD: LocketCloud/image/...jpg)

  if (!key) return res.status(400).json({ error: "Missing key" });
  logInfo("deleteFileFromR2", `📦 Xoá file: ${key}`);
  try {
    const command = new DeleteObjectCommand({
      Bucket: constants.BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    logSuccess("DeletedFile", "✅ Xoá thành công", key);
    res.json({ success: true, message: "File deleted" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};

/**
 * Xoá toàn bộ file trong bucket theo ngày (prefix dạng D-27-08-25)
 * @param {string} basePath - VD: "LocketCloud/image/"
 * @param {string} dayFolder - VD: "D-27-08-25"
 */
exports.deleteFilesByDay = async (req, res) => {
  const { basePath, dayFolder } = req.body;

  if (!basePath || !dayFolder) {
    return res.status(400).json({ error: "Missing basePath or dayFolder" });
  }

  try {
    const prefix = `${basePath}${dayFolder}/`;
    logInfo("deleteFilesByDay", `🧹 Đang xoá toàn bộ file trong ${prefix}`);

    // Liệt kê object trong prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: constants.BUCKET_NAME,
      Prefix: prefix,
    });
    const response = await s3.send(listCommand);

    if (!response.Contents || response.Contents.length === 0) {
      logInfo("deleteFilesByDay", `Không tìm thấy file nào trong ${prefix}`);
      return res.json({ success: true, message: "Không có file nào để xoá" });
    }

    // Tạo danh sách Keys để xoá
    const objectsToDelete = response.Contents.map((file) => ({
      Key: file.Key,
    }));

    // Xoá 1 lượt (tối đa 1000 keys/lần)
    const delCommand = new DeleteObjectsCommand({
      Bucket: constants.BUCKET_NAME,
      Delete: { Objects: objectsToDelete },
    });
    await s3.send(delCommand);

    logSuccess(
      "deleteFilesByDay",
      `🎉 Đã xoá ${objectsToDelete.length} file trong ${prefix}`
    );
    res.json({
      success: true,
      message: `Đã xoá ${objectsToDelete.length} file trong ${prefix}`,
    });
  } catch (error) {
    console.error("❌ Lỗi khi xoá theo ngày:", error);
    res.status(500).json({ error: "Lỗi khi xoá file theo ngày" });
  }
};

exports.deleteFilesByDayV2 = async (basePath, dayFolder) => {
  if (!basePath || !dayFolder) {
    return { success: false, message: "Missing basePath or dayFolder" };
  }

  try {
    const prefix = `${basePath}${dayFolder}/`;
    logInfo("deleteFilesByDayV2", `🧹 Đang xoá toàn bộ file trong ${prefix}`);

    // Liệt kê object trong prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: constants.BUCKET_NAME,
      Prefix: prefix,
    });
    const response = await s3.send(listCommand);

    if (!response.Contents || response.Contents.length === 0) {
      logInfo("deleteFilesByDayV2", `Không tìm thấy file nào trong ${prefix}`);
      return {
        success: true,
        message: "Không có file nào để xoá",
        deletedCount: 0,
      };
    }

    // Tạo danh sách Keys để xoá
    const objectsToDelete = response.Contents.map((file) => ({
      Key: file.Key,
    }));

    // Xoá 1 lượt (tối đa 1000 keys/lần)
    const delCommand = new DeleteObjectsCommand({
      Bucket: constants.BUCKET_NAME,
      Delete: { Objects: objectsToDelete },
    });
    await s3.send(delCommand);

    logSuccess(
      "deleteFilesByDayV2",
      `🎉 Đã xoá ${objectsToDelete.length} file trong ${prefix}`
    );
    return {
      success: true,
      message: "Xoá thành công",
      deletedCount: objectsToDelete.length,
    };
  } catch (error) {
    console.error("❌ Lỗi khi xoá theo ngày:", error);
    return { success: false, message: "Lỗi khi xoá", error };
  }
};
