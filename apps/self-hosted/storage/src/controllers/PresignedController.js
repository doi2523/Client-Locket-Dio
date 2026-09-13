const {
  s3,
  PutObjectCommand,
  getSignedUrl,
} = require("../../config/r2-storage");
const constants = require("../constants/storageConfig");
const { getTodayFolder } = require("../utils/getDayFolder");
const { logSuccess, logInfo, logWarning } = require("../utils/logEventUtils");

const ALLOWED_MIME_TYPES = [
  // images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",

  // videos
  "video/mp4",
  "video/webm",
  "video/quicktime", // mov
];
//API chuẩn V3
exports.generatePresignedUrlV3 = async (req, res) => {
  const { filename, contentType, size, uploadedAt, type } = req.body;

  logInfo("generatePresignedUrlV2", `📩 Tạo URL presigned`, req.body);
  const { uid } = req.user;

  if (!filename || !type) {
    return res.status(400).json({
      status: "error",
      message: "Request body must include 'filename' and 'type'",
      errorCode: "MISSING_BODY_FIELDS",
    });
  }

  // 1️⃣ check mime
  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    return res.status(400).json({
      status: "error",
      message: "File type not allowed",
      errorCode: "INVALID_FILE_TYPE",
      allowed: ALLOWED_MIME_TYPES,
    });
  }

  // 3️⃣ ép type theo mime (chống fake type)
  const safeType = contentType.startsWith("video/") ? "video" : "image";

  logInfo("generatePresignedUrlV2", `📩 Yêu cầu tạo URL cho: ${filename}`);

  const folderName = getTodayFolder();
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  const filePath = `LocketCloud/${folderName}/${safeType}/${uid}/${safeFilename}`; // => path trên R2

  try {
    // 2️⃣ nếu chưa tồn tại thì mới generate URL
    const command = new PutObjectCommand({
      Bucket: constants.BUCKET_NAME,
      Key: filePath,
      ContentType: safeType,
      ACL: "public-read",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    logSuccess("GeneratedPresignedUrlV2", "✅ URL thành công", filePath);

    return res.status(200).json({
      status: "success",
      data: {
        url,
        expiresIn: 300, // 5 phút
        key: filePath,
        publicURL: `${constants.MEDIA_URL}/${filePath}`,
      },
      message: "Presigned URL generated successfully",
      meta: {
        note: "Use this URL only once — it will expire in 5 minutes!",
        uk: "null because this is not a user-specific action",
        me: "u not admin",
        u: uid,
      },
    });
  } catch (err) {
    console.error("❌ Presigned V2 error:", err);

    return res.status(500).json({
      status: "error",
      message: "Failed to generate presigned URL",
      errorCode: "INTERNAL_ERROR",
    });
  }
};
