export function isIOS() {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;

  // iPhone | iPad | iPod (kể cả iPadOS mới giả Mac)
  return (
    /iPad|iPhone|iPod/i.test(ua) ||
    // iPadOS 13+ báo MacIntel nhưng có touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}
