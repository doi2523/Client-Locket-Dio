const { getYesterdayFolder } = require("../utils/getDayFolder");
const { deleteFilesByDayV2 } = require("./DeleteController");

const API_KEY = process.env.CLEANER_KEY_ID; // để trong .env cho bảo mật

exports.cleanByDay = async (req, res) => {
  try {
    // ✅ Lấy key từ header
    const clientKey = req.headers["x-api-key"];

    if (!clientKey || clientKey !== API_KEY) {
      return res.status(403).json({ success: false, message: "Không có quyền chạy job" });
    }

    const dayFolder = getYesterdayFolder();

    // chạy 2 job song song
    const [imageResult, videoResult, allResult] = await Promise.all([
      deleteFilesByDayV2("LocketCloud/image/", dayFolder),
      deleteFilesByDayV2("LocketCloud/video/", dayFolder),
      deleteFilesByDayV2("LocketCloud/", dayFolder),
    ]);

    return res.json({
      success: true,
      message: "Đã xoá xong cả image và video",
      results: {
        image: imageResult,
        video: videoResult,
        all: allResult,
        date: dayFolder,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi cleanByDay:", err);
    return res.status(500).json({ success: false, message: "Có lỗi khi xoá file", error: err.message });
  }
};
