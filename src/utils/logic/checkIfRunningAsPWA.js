export const checkIfRunningAsPWA = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true || // iOS
    document.referrer.includes("android-app://")
  );
};