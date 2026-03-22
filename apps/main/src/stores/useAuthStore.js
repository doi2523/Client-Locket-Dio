import { clearAllDB } from "@/cache/configDB";
import {
  GetUserDataV2,
  GetUserLocket,
  logout,
  updateUserInfo,
} from "@/services";
import {
  removeToken,
  saveMemberToken,
  clearMemberToken,
  saveUserCache,
  getUserCache,
  clearUserCache,
} from "@/utils";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  userPlan: null,
  uploadStats: null,
  isAuth: false,
  loading: true,

  // =========================
  // 1️⃣ HYDRATE – sync, render ngay
  // =========================
  hydrateAuth: () => {
    const token = localStorage.getItem("idToken");
    const cachedUser = getUserCache();

    if (!token) {
      set({
        user: null,
        isAuth: false,
        loading: false,
      });
      return;
    }

    if (cachedUser) {
      set({
        user: cachedUser,
        isAuth: true,
        loading: false,
      });
      return;
    }

    set({ isAuth: true, loading: false });
  },

  initAuth: async () => {
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
      const planRes = await GetUserDataV2();

      saveMemberToken(planRes?.session);

      set({
        userPlan: planRes,
        uploadStats: planRes?.upload_stats,
      });

      // lấy user từ cache
      let userInfo = getUserCache();

      if (userInfo) {
        set({ user: userInfo });
      } else {
        userInfo = await GetUserLocket();
        saveUserCache(userInfo);
        set({ user: userInfo });
      }

      if (userInfo) await updateUserInfo(userInfo);
    } catch (err) {
      console.error("Auth init error:", err);
      set({
        user: null,
        userPlan: null,
        uploadStats: null,
        isAuth: false,
      });
    }
  },

  fetchUserData: async () => {
    try {
      set({ loading: true });

      const planRes = await GetUserDataV2();

      // lưu token
      saveMemberToken(planRes?.session);
      set({
        userPlan: planRes,
        uploadStats: planRes?.upload_stats,
        loading: false,
      });
    } catch (err) {
      console.error("fetchUserData error:", err);
      set({ loading: false });
    }
  },

  clearAndlogout: async () => {
    await logout();
    removeToken();
    await clearAllDB();

    clearMemberToken();
    clearUserCache();

    set({
      user: null,
      userPlan: null,
      uploadStats: null,
      isAuth: false,
    });
  },
}));
