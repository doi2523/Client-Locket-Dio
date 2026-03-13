import { detectAppEnvironment } from "../logic/checkIfRunningAsPWA";

/**
 * Hiển thị cảnh báo nổi bật trên console giống Facebook
 * @param {string} title - Tiêu đề cảnh báo
 * @param {string} message - Nội dung mô tả
 */
export function showDevWarning(title = "Dừng lại!", message = "") {
  if (typeof window === "undefined") return; // tránh lỗi SSR

  console.log(
    "%c" + title,
    "color: #ffcc00; font-size: 40px; font-weight: bold; text-shadow: 1px 1px 2px #000;"
  );

  // console.log(
  //   "%c" + message,
  //   "color: #ffffff; background: #ff0000; padding: 6px 10px; font-size: 14px; border-radius: 4px;"
  // );

  console.log(
    "%cĐây là bảng console dành cho nhà phát triển. " +
      "Nếu ai đó bảo bạn dán đoạn code vào đây, có thể tài khoản của bạn sẽ bị xâm nhập.",
    "color: #ff6f00; font-weight: bold; font-size: 13px;"
  );
  console.log(
    "%c👉 Nếu bạn cần hỗ trợ chính thức, hãy truy cập: https://locket-dio.com/contact",
    "color: #00bcd4; font-weight: bold; font-size: 13px;"
  );
  console.log(
    `🚀 App running in: ${detectAppEnvironment() ? "PWA" : "Web"} mode`
  );
}
