import { CONFIG } from "@/config";

export function getImageSrc(url) {
  if (!url) return "";

  const lower = url.toLowerCase();

  // chỉ convert khi là heic / heif
  if (lower.includes(".heic") || lower.includes(".heif")) {
    return `${CONFIG.api.convertApi}/api/convert?url=${encodeURIComponent(url)}`;
  }

  // các định dạng khác dùng thẳng
  return url;
}

