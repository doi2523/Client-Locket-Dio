const os = require("os");
const fs = require("fs");
const path = require("path");
const { getTodayFolder } = require("../utils/getTodayFolder");
const { logError, logInfo } = require("../utils/logEventUtils");

const saveUploadFile = async (req, res, next) => {
  try {
    if (!req.files && !req.file) return next();

    const files = req.files || [req.file];
    
    logInfo("saveUploadFile", "Nhận files từ client");

    const tmpBaseDir = path.join(os.tmpdir(), "uploads-media");

    const results = [];

    for (const file of files) {
      const isImage = file.mimetype.startsWith("image");

      const uploadDir = isImage
        ? path.join(tmpBaseDir, getTodayFolder(), "images")
        : path.join(tmpBaseDir, getTodayFolder(), "videos");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = path.extname(file.originalname);
      const safeName = `${Date.now()}_${file.originalname.replace(/\s/g, "_")}`;

      const filePath = path.join(uploadDir, safeName);

      fs.writeFileSync(filePath, file.buffer);

      const buffer = fs.readFileSync(filePath);

      results.push({
        buffer,
        path: filePath,
        mimetype: file.mimetype,
        originalname: file.originalname,
      });
    }

    req.uploadedFiles = results;

    next();
  } catch (err) {
    logError("saveUploadFile", err.message);
    return res.status(500).json({ error: "Upload middleware error" });
  }
};

module.exports = saveUploadFile;