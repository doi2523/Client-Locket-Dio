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
      return toast.success(message, baseConfig);

    case "error":
      return toast.error(message, {
        ...baseConfig,
        duration: 5000,
      });

    case "warning":
      return toast.warning(message, {
        ...baseConfig,
        duration: 3500,
      });

    case "info":
      return toast.info(message, {
        ...baseConfig,
        duration: 3000,
      });

    default:
      return toast(message, baseConfig);
  }
}

// Promise Toast
export const SonnerPromise = (
  promise,
  {
    loading = "Đang xử lý...",
    success = "Thành công!",
    error = "Có lỗi xảy ra!",
    description = {},
    options = {},
  } = {},
) => {
  toast.promise(promise, {
    loading,
    success: (data) => ({
      message: typeof success === "function" ? success(data) : success,
      description: description.success,
    }),
    error: (err) => ({
      message: typeof error === "function" ? error(err) : error,
      description: description.error,
    }),

    position: "top-center",
    richColors: true,
    dismissible: true,
    closeButton: false,

    ...options,
  });
};

// Export helpers
export const SonnerSuccess = (msg, body = "", opt) =>
  showToast("success", msg, body, opt);

export const SonnerError = (msg, body = "", opt) =>
  showToast("error", msg, body, opt);

export const SonnerWarning = (msg, body = "", opt) =>
  showToast("warning", msg, body, opt);

export const SonnerInfo = (msg, body = "", opt) =>
  showToast("info", msg, body, opt);
