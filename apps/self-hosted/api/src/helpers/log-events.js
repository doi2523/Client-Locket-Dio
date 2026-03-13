const fs = require("fs").promises;
const path = require("path");
const { format } = require("../../node_modules/date-fns");

const logDirectory = path.join(__dirname, "../logs");

const createLogDirectory = async () => {
  try {
    await fs.mkdir(logDirectory, { recursive: true });
  } catch (err) {
    console.error("Error creating log directory:", err);
  }
};

const manageLogFiles = async (logDirectory, maxFiles) => {
  try {
    const files = await fs.readdir(logDirectory);
    const logFiles = await Promise.all(
      files.map(async (file) => {
        // Lấy thông tin về file này
        const stat = await fs.stat(path.join(logDirectory, file));
        return {
          name: file,

          // Thời gian sửa đổi lần cuối cùng của file
          time: stat.mtime.getTime(),
        };
      }),
    );

    logFiles.sort((a, b) => a.time - b.time);
    const sortedLogFiles = logFiles.map((file) => file.name);

    // Xóa các file log cũ nếu vượt quá số file tối đa
    if (sortedLogFiles.length > maxFiles) {
      const filesToDelete = sortedLogFiles.slice(maxFiles);
      for (const file of filesToDelete) {
        await fs.unlink(path.join(logDirectory, file));
      }
    }
  } catch (err) {
    console.error("Error managing log files:", err);
  }
};

const logEvents = async (msg) => {
  await createLogDirectory();

  const dateTime = `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}`;
  const logFileName = `${format(new Date(), "dd-MM-yyyy")}.log`;
  const fileName = path.join(logDirectory, logFileName);
  const contentLog = `${dateTime} ----- ${msg}\n`;

  try {
    await fs.appendFile(fileName, contentLog);

    // Quản lý các file log và xóa file cũ nếu cần
    await manageLogFiles(logDirectory, 10);
  } catch (error) {
    console.error("Error logging event:", error);
  }
};

module.exports = logEvents;
