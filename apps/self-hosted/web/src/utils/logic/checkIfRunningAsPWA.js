export const checkIfRunningAsPWA = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true || // iOS
    document.referrer.includes("android-app://")
  );
};

export const detectAppEnvironment = () => {
  // Kiểm tra display mode
  if (
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    return true;
  }

  // Kiểm tra navigator.standalone cho iOS
  if (window.navigator.standalone === true) {
    return true;
  }

  // Kiểm tra document.referrer cho Android
  if (document.referrer.includes("android-app://")) {
    return true;
  }

  // Kiểm tra user agent cho các trường hợp khác
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("wv") || userAgent.includes("webview")) {
    return true;
  }

  return false;
};
