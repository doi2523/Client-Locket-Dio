const axios = require("axios");
const serverConfig = require("../../config/app.config");

const deleteFileFromStorageR2 = async (filePath) => {
  const { services } = serverConfig;
  try {
    const res = await axios.post(
      `${services.storageUrl}/api/delete`,
      { key: filePath }, // body
      {
        headers: {
          "Content-Type": "application/json",
          // Nếu có auth token nội bộ giữa servers:
          // Authorization: `Bearer ${YOUR_INTERNAL_SECRET_TOKEN}`,
        },
      },
    );

    // axios trả về data trực tiếp
    const data = res.data;

    if (data.success) {
      console.log(`✅ Deleted from R2: ${filePath} | Message: ${data.message}`);
      return { success: true, message: data.message };
    } else {
      console.error(
        `❌ Delete failed (R2): ${filePath}`,
        data.error || "Unknown error",
      );
      return { success: false, error: data.error || "Delete failed" };
    }
  } catch (error) {
    console.error(`❌ Failed to delete from R2: ${filePath}`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  deleteFileFromStorageR2,
};
