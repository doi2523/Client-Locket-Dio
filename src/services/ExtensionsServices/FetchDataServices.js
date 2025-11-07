import { instanceBase } from "@/lib/axios.base";

/**
 * Lấy danh sách hoặc chi tiết bài viết.
 * @param {string} [slug] - slug của bài viết (nếu có).
 */
export const getListNewFeeds = async (slug) => {
  try {
    // Nếu có slug → lấy 1 bài cụ thể
    const url = slug ? `/locketpro/feeds?slug=${slug}` : "/locketpro/feeds";
    const res = await instanceBase.get(url);

    if (!res?.data) {
      console.error("❌ Không có dữ liệu hợp lệ", res?.data);
      return null;
    }

    // Nếu là danh sách → sort theo published_at
    if (!slug && Array.isArray(res.data)) {
      return [...res.data].sort(
        (a, b) => new Date(b.published_at) - new Date(a.published_at)
      );
    }

    // Nếu là bài chi tiết → trả thẳng object
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};
