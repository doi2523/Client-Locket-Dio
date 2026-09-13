const fs = require("fs");
const { logWarning, logSuccess } = require("../../utils/logEventUtils");

const deleteTempFile = (filePath) => {
  if (!filePath) return;

  fs.unlink(filePath, (err) => {
    if (err) {
      logWarning("deleteTempFile", "❌ Error deleting file", {
        filePath,
        error: err,
      });
    } else {
      logSuccess("deleteTempFile", "✅ File deleted successfully", {
        filePath,
      });
    }
  });
};

module.exports = {
  deleteTempFile,
};
