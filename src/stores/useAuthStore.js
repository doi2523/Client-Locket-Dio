import {
  GetUserDataV2,
  GetUserLocket,
  logout,
  updateUserInfo,
} from "@/services";
import { create } from "zustand";

const CACHE_KEY = "userData";
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 1 ngày

export const useAuthStore = create((set) => ({
  user: null,
  userPlan: null,
  uploadStats: null,
  isAuth: false,
  loading: true,

  // =========================
  // 1️⃣ HYDRATE – sync, render ngay
  // =========================
  hydrate: () => {
    const token = localStorage.getItem("idToken");
    const cached = localStorage.getItem(CACHE_KEY);

    if (!token) {
      set({
        user: null,
        isAuth: false,
        loading: false,
      });
      return;
    }

    if (cached) {
      try {
        const { data } = JSON.parse(cached);
        set({
          user: data,
          isAuth: true,
          loading: false, // ✅ render ngay
        });
        return;
      } catch {}
    }

    set({ isAuth: true, loading: false });
  },

  init: async () => {
    const token = localStorage.getItem("idToken");

    if (!token) {
      set({
        user: null,
        userPlan: null,
        uploadStats: null,
        isAuth: false,
        loading: false,
      });
      return;
    }

    try {
      // 1️⃣ Lấy plan luôn
      const planRes = await GetUserDataV2();
      set({
        userPlan: planRes,
        uploadStats: planRes?.upload_stats,
      });

      // 2️⃣ Hiển thị user từ cache ngay nếu có
      const now = Date.now();
      let cached = localStorage.getItem(CACHE_KEY);
      let userInfo = null;

      if (cached) {
        const parsed = JSON.parse(cached);
        userInfo = parsed.data;
        // Nếu cache chưa quá hạn thì dùng ngay
        if (now - parsed.timestamp < CACHE_DURATION_MS) {
          set({ user: userInfo }); // hiển thị nhanh
        } else {
          userInfo = null; // cache quá hạn, fetch lại
        }
      }

      // 3️⃣ Nếu chưa có cache hoặc quá hạn → gọi GetUserLocket()
      if (!userInfo) {
        userInfo = await GetUserLocket();
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: userInfo, timestamp: now })
        );
        set({ user: userInfo }); // cập nhật store khi fetch xong
      }

      // 4️⃣ Cập nhật backend nếu cần
      if (userInfo) await updateUserInfo(userInfo);
    } catch (err) {
      console.error("Auth init error:", err);
      set({
        user: null,
        userPlan: null,
        uploadStats: null,
        isAuth: false,
        // loading: false,
      });
    }
  },

  clearAndlogout: async () => {
    await logout();
    localStorage.removeItem(CACHE_KEY); // xóa cache khi logout
    set({
      user: null,
      userPlan: null,
      uploadStats: null,
      isAuth: false,
    });
  },
}));
