const { format } = require("date-fns");

const colors = {
  green: "\x1b[32m", // Success
  blue: "\x1b[34m", // Info
  red: "\x1b[31m", // Error
  cyan: "\x1b[36m", // Loading
  orange: "\x1b[33m", // Timestamp
  yellow: "\x1b[33m", // Warning
  purple: "\x1b[35m", // Debug
  magenta: "\x1b[95m", // Caller - bright magenta
  white: "\x1b[97m", // Normal - bright white
  brightBlue: "\x1b[94m", // Meta - bright blue
  brightGreen: "\x1b[92m", // Success alt
  brightRed: "\x1b[91m", // Error alt
  brightYellow: "\x1b[93m", // Warning alt
  brightCyan: "\x1b[96m", // Info alt
  reset: "\x1b[0m", // Reset
  bold: "\x1b[1m", // Bold
  dim: "\x1b[2m", // Dim
};

const icons = {
  info: "ℹ",
  success: "✓",
  error: "✗",
  warning: "⚠",
  loading: "⟳",
  debug: "🐛",
};

const logStyles = {
  INFO: { color: colors.brightCyan, icon: icons.info, label: "INFO" },
  SUCCESS: { color: colors.brightGreen, icon: icons.success, label: "SUCCESS" },
  ERROR: { color: colors.brightRed, icon: icons.error, label: "ERROR" },
  WARNING: {
    color: colors.brightYellow,
    icon: icons.warning,
    label: "WARNING",
  },
  LOADING: { color: colors.cyan, icon: icons.loading, label: "LOADING" },
  DEBUG: { color: colors.purple, icon: icons.debug, label: "DEBUG" },
  NOTICE: { color: colors.brightBlue, icon: "📌", label: "NOTICE" },
};

const createBox = (content) => {
  const borderColor = colors.brightCyan;
  const textColor = colors.magenta;
  const width = 60;

  const lines = content.split("\n");
  const maxLength = Math.max(...lines.map((line) => line.length), 10);
  const boxWidth = Math.min(Math.max(maxLength + 4, width), 80);

  const topBorder = `${borderColor}╭${"─".repeat(boxWidth - 2)}╮${
    colors.reset
  }`;
  const bottomBorder = `${borderColor}╰${"─".repeat(boxWidth - 2)}╯${
    colors.reset
  }`;

  console.log(topBorder);
  lines.forEach((line) => {
    const totalPadding = boxWidth - line.length - 4;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    console.log(
      `${borderColor}│${colors.reset} ${" ".repeat(
        leftPadding
      )}${textColor}${line}${colors.reset}${" ".repeat(
        rightPadding
      )} ${borderColor}│${colors.reset}`
    );
  });
  console.log(bottomBorder);
};

const formatMessage = (input) => {
  if (typeof input === "object" && input !== null) {
    return JSON.stringify(input, null, 2);
  }
  return String(input);
};

const logMessage = (level, caller, message, meta = null) => {
  const style = logStyles[level];
  const timestamp = format(new Date(), "dd/MM/yyyy HH:mm:ss");

  const header = `${colors.orange}${timestamp}${colors.reset} ${style.color}${style.icon} ${style.label}${colors.reset} ${colors.magenta}[${caller}]${colors.reset}`;
  const formattedMessage = formatMessage(message);
  const [firstLine, ...remainingLines] = formattedMessage.split("\n");

  // In dòng đầu tiên
  console.log(`${header} ${style.color}▌${colors.reset} ${colors.white}${firstLine}${colors.reset}`);

  // In các dòng còn lại (không padding)
  remainingLines.forEach((line) => {
    console.log(`${style.color}▌${colors.reset} ${colors.white}${line}${colors.reset}`);
  });

  // Metadata block
  if (meta) {
    const metaLines = [];

    if (typeof meta === "object" && !Array.isArray(meta)) {
      Object.entries(meta).forEach(([key, value]) => {
        const val = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
        const lines = val.split("\n");
        metaLines.push(`${key}: ${lines[0]}`);
        lines.slice(1).forEach((line) => {
          metaLines.push(`  ${line}`);
        });
      });
    } else {
      metaLines.push(...String(meta).split("\n"));
    }

    const maxContentLength = Math.max(...metaLines.map((line) => line.length));
    const frameWidth = maxContentLength + 4;
    const horizontalLine = "─".repeat(frameWidth);

    // In khung metadata không padding
    console.log(`${colors.brightBlue}┌${horizontalLine}┐${colors.reset}`);
    metaLines.forEach((line) => {
      const spacePadding = " ".repeat(frameWidth - line.length - 2);
      console.log(`${colors.brightBlue}│ ${colors.white}${line}${spacePadding}${colors.brightBlue} │${colors.reset}`);
    });
    console.log(`${colors.brightBlue}└${horizontalLine}┘${colors.reset}`);
  }
};

// Hàm tạo banner đẹp cho ứng dụng
const logBanner = (title, version = null) => {
  const content = version ? `${title}\nVersion: ${version}` : title;
  createBox(content, colors.brightCyan, 60);
};

// Hàm log với progress bar
const logProgress = (caller, message, current, total) => {
  const percentage = Math.round((current / total) * 100);
  const barLength = 20;
  const filledLength = Math.round((percentage / 100) * barLength);
  const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

  const progressMessage = `${message} [${colors.brightGreen}${bar}${colors.reset}] ${colors.brightYellow}${percentage}%${colors.reset} (${colors.white}${current}/${total}${colors.reset})`;
  logMessage("LOADING", caller, progressMessage);
};

// Hàm log table đẹp
const logTable = (caller, data, title = "Data Table") => {
  console.log();
  console.log(
    `${colors.brightBlue}📊 ${colors.white}${title} ${colors.magenta}[${caller}]${colors.reset}`
  );
  console.log(`${colors.brightBlue}${"═".repeat(60)}${colors.reset}`);
  console.table(data);
  console.log();
};

// Các hàm log chính
const logInfo = (caller, message = "Information", meta = null) =>
  logMessage("INFO", caller, message, meta);

const logError = (caller, message, meta = null) =>
  logMessage("ERROR", caller, message, meta);

const logSuccess = (caller, message, meta = null) =>
  logMessage("SUCCESS", caller, message, meta);

const logLoading = (caller, message = "Loading...", meta = null) =>
  logMessage("LOADING", caller, message, meta);

const logWarning = (caller, message, meta = null) =>
  logMessage("WARNING", caller, message, meta);

const logDebug = (caller, message, meta = null) =>
  logMessage("DEBUG", caller, message, meta);

const logNotice = (caller, message = "Important note", meta = null) =>
  logMessage("NOTICE", caller, message, meta);

// Hàm utility để tạo group logs
const logGroup = async (title, callback) => {
  console.log(
    `\n${colors.bold}${colors.brightCyan}┌─ Start ${colors.white}${title}${colors.brightCyan} ─${colors.reset}`
  );
  try {
    await callback(); // Đợi hàm async hoàn tất trước khi kết thúc group
  } catch (err) {
    // Nếu callback bị lỗi vẫn đảm bảo End group được in ra
    logError("logGroup", "Error during group callback", err.message);
  } finally {
    console.log(
      `${colors.bold}${colors.brightCyan}└─ End ${colors.white}${title}${colors.brightCyan} ─${colors.reset}\n`
    );
  }
};

// Hàm log performance
const logPerformance = (caller, label, startTime) => {
  const endTime = Date.now();
  const duration = endTime - startTime;
  const message = `${label} completed in ${colors.brightYellow}${duration}ms${colors.reset}`;

  if (duration < 100) {
    logSuccess(caller, message);
  } else if (duration < 1000) {
    logWarning(caller, message);
  } else {
    logError(caller, message);
  }
};
const logGroupWrapper = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;

  const ignored = ["/", "/favicon.ico"];
  if (ignored.includes(url)) return next();

  // Bắt đầu group
  console.log(
    `\n${colors.bold}${colors.brightCyan}┌─ Start 🔁 ${method} ${url} ─${colors.reset}`
  );

  // Đợi khi response gửi xong mới kết thúc group
  res.on("finish", () => {
    console.log(
      `${colors.bold}${colors.brightCyan}└─ End 🔁 ${method} ${url} ─${colors.reset}\n`
    );
  });

  next(); // Vẫn gọi next bình thường
};

module.exports = {
  logInfo,
  logError,
  logSuccess,
  logLoading,
  logWarning,
  logDebug,
  logBanner,
  logProgress,
  logTable,
  logGroup,
  logPerformance,
  logNotice,
  logGroupWrapper,
};
