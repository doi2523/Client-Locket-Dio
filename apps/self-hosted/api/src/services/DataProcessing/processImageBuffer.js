const sharp = require("sharp");
const heicConvert = require("heic-convert");
const { logSuccess } = require("../../utils/logEventUtils");

const logInfo = (tag, message) => {
  console.log(`[${tag.toUpperCase()}] ${message}`);
};

const prepareImageForProcessing = async (imageBuffer) => {
  try {
    let image = sharp(imageBuffer).rotate(); // 🟢 Auto-fix orientation
    const metadata = await image.metadata();
    const { format } = metadata;

    logInfo("prepareImage", `Detected format: ${format}`);
    const unsupportedFormats = ["heif", "heic"];

    if (unsupportedFormats.includes(format?.toLowerCase())) {
      logInfo(
        "prepareImage",
        `Using heic-convert to convert ${format} to JPEG`
      );

      const jpegBuffer = await heicConvert({
        buffer: imageBuffer,
        format: "JPEG",
        quality: 1,
      });

      image = sharp(jpegBuffer).rotate(); // 🟢 Rotate again after converting
      logInfo("prepareImage", "✅ Successfully converted HEIC to JPEG");
    }

    return image;
  } catch (err) {
    logInfo("prepareImage", `Error preparing image: ${err.message}`);
    throw new Error("Cannot prepare image format: " + err.message);
  }
};

const processImageBuffer = async ({
  imageBuffer,
  maxSizeMB = 1,
  resolution = 1440, // px cho chiều dài mỗi cạnh
}) => {
  try {
    logInfo("processImageBuffer", "Start processing image buffer to webp...");

    let image = await prepareImageForProcessing(imageBuffer);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    logInfo("processImageBuffer", `Original size: ${width}x${height}`);

    logInfo(
      "processImageBuffer",
      `🖼️ Resize resolution -> ${resolution}x${resolution}px (fit: cover, center crop)`
    );
    image = image.resize(resolution, resolution, {
      fit: "cover", // Tự crop giữa ảnh nếu không vuông
      position: "center", // Crop phần trung tâm
    });

    // Bước 2: Nén webp với nhiều mức chất lượng
    let quality = 90;
    let compressedBuffer;

    while (quality >= 30) {
      compressedBuffer = await image.webp({ quality }).toBuffer();
      const sizeInMB = (compressedBuffer.length / 1024 / 1024).toFixed(2);
      logInfo(
        "processImageBuffer",
        `Tried quality ${quality}, size = ${sizeInMB}MB`
      );

      if (compressedBuffer.length <= maxSizeMB * 1024 * 1024) break;
      quality -= 10;
    }

    // Nếu vẫn quá lớn, thử resize nhỏ hơn (720x720)
    if (compressedBuffer.length > maxSizeMB * 1024 * 1024) {
      logInfo("processImageBuffer", `Still too large. Trying resize to 720px`);
      image = image.resize(720, 720, {
        fit: "cover",
        position: "center",
      });
      compressedBuffer = await image.webp({ quality: 70 }).toBuffer();
    }

    const finalSize = (compressedBuffer.length / 1024 / 1024).toFixed(2);
    logInfo("processImageBuffer", `✅ Final image size: ${finalSize}MB`);

    logSuccess("processImageBuffer", "✅ End processing image buffer.");
    return compressedBuffer;
  } catch (err) {
    throw new Error("❌ Lỗi xử lý ảnh: " + err.message);
  }
};

module.exports = {
  processImageBuffer,
};
