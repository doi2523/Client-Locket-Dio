import { PUBLIC_API } from "@/config/apiConfig";
import { instanceBaseData } from "@/lib/axios.data";

/**
 * Lấy danh sách hoặc chi tiết bài viết.
 * @param {string} [slug] - slug của bài viết (nếu có).
 */
export const getListNewFeeds = async (slug) => {
  try {
    // Nếu có slug → lấy 1 bài cụ thể
    const url = slug ? `${PUBLIC_API.feeds}?slug=${slug}` : PUBLIC_API.feeds;
    const res = await instanceBaseData.get(url);

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
export const getListDonates = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.donations);
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};

export const getListIncidents = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.incidents);
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};

export const getAllTimelines = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.timelines);
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};
export const getAllFrameCamera = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.frames);
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};
export const getListCelebrity = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.celebrates);
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};
export const getNotifications = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.notifications);
    return res;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};

export const GetListInfoPlans = async () => {
  try {
    const response = await instanceBaseData.get(PUBLIC_API.plans);

    return response.data;
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    throw error;
  }
};
export const GetInfoPlanWithId = async (planId) => {
  try {
    const url = `${PUBLIC_API.plans}/${planId}`;
    const response = await instanceBaseData.get(url);

    return response.data;
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    throw error;
  }
};
export const getAllOverlayCaption = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.themes);
    if (!res?.data) {
      console.error("❌ Không có dữ liệu hợp lệ", res?.data);
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return null;
  }
};

export const getAllCollections = async () => {
  try {
    const res = await instanceBaseData.get(PUBLIC_API.collection);
    if (!res?.data) {
      console.error("❌ Không có dữ liệu hợp lệ", res?.data);
      return [];
    }
    return res.data;
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API:", error.message);
    return [];
  }
};
