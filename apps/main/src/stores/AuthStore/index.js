import { clearAllDB } from "@/cache/configDB";
import {
  GetUserDataV2,
  GetUserLocket,
  logout,
  syncPushSubscription,
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
import { persist } from "zustand/middleware";

const ONE_DAY = 1000 * 60 * 60 * 24;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userPlan: null,
      uploadStats: null,
      isAuth: false,
      loading: true,

      lastSyncAt: 0,
      lastFetchPlanAt: 0,

      // =========================
      // HYDRATE
      // =========================
      hydrateAuth: () => {
        const token = localStorage.getItem("idToken");

        if (!token) {
          set({
            user: null,
            isAuth: false,
            loading: false,
          });
          return;
        }

        // ⚡ dùng luôn data đã persist
        set({
          isAuth: true,
          loading: false,
        });
      },

      // =========================
      // INIT
      // =========================
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

        const now = Date.now();
        const { lastFetchPlanAt, lastSyncAt } = get();

        try {
          // =========================
          // 1. Fetch plan nếu quá TTL
          // =========================
          if (!lastFetchPlanAt || now - lastFetchPlanAt > 5 * 60 * 1000) {
            const planRes = await GetUserDataV2();

            saveMemberToken(planRes?.session);

            set({
              userPlan: planRes,
              uploadStats: planRes?.upload_stats,
              lastFetchPlanAt: now,
            });
          }

          // =========================
          // 2. Fetch user nếu chưa có
          // =========================
          let { user } = get();

          if (!user) {
            user = await GetUserLocket();
            set({ user });
          }

          // =========================
          // 3. Background sync (1 ngày)
          // =========================
          if (!lastSyncAt || now - lastSyncAt > ONE_DAY) {
            updateUserInfo(user).catch(() => {});
            syncPushSubscription().catch(() => {});

            set({ lastSyncAt: now });
          }

          set({ isAuth: true, loading: false });
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

      // =========================
      // FORCE REFRESH
      // =========================
      fetchUserData: async () => {
        try {
          set({ loading: true });

          const planRes = await GetUserDataV2();

          saveMemberToken(planRes?.session);

          set({
            userPlan: planRes,
            uploadStats: planRes?.upload_stats,
            lastFetchPlanAt: Date.now(),
            loading: false,
          });
        } catch (err) {
          console.error("fetchUserData error:", err);
          set({ loading: false });
        }
      },

      // =========================
      // LOGOUT
      // =========================
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
          lastSyncAt: 0,
          lastFetchPlanAt: 0,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        userPlan: state.userPlan,
        uploadStats: state.uploadStats,
        lastSyncAt: state.lastSyncAt,
        lastFetchPlanAt: state.lastFetchPlanAt,
      }),
    },
  ),
);
