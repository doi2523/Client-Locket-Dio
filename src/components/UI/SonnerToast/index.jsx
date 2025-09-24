import { toast } from "sonner";

// Base toast
function showToast(type, message, body = "", options = {}) {
  const baseConfig = {
    position: "top-center",
    richColors: true,
    dismissible: true, // click vào toast sẽ đóng
    duration: 4000,
    description: body || undefined, // body sẽ hiển thị dưới message
    closeButton: false,
    ...options,
  };

  switch (type) {
    case "success":
      toast.success(message, baseConfig);
      break;
    case "error":
      toast.error(message, {
        ...baseConfig,
        duration: 5000,
      });
      break;
    case "warning":
      toast.warning(message, {
        ...baseConfig,
        duration: 3500,
        closeButton: true,
      });
      break;
    case "info":
      toast(message, {
        ...baseConfig,
        duration: 3000,
      });
      break;
    default:
      toast(message, baseConfig);
  }
}

// Export helpers
export const SonnerSuccess = (msg, body = "", opt) => showToast("success", msg, body, opt);
export const SonnerError   = (msg, body = "", opt) => showToast("error", msg, body, opt);
export const SonnerWarning = (msg, body = "", opt) => showToast("warning", msg, body, opt);
export const SonnerInfo    = (msg, body = "", opt) => showToast("info", msg, body, opt);
