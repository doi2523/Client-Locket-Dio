// src/store/useStreakStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { GetLastestMoment } from "@/services";
import { formatYYYYMMDD } from "@/utils";

export const useStreakStore = create(
  persist(
    (set, get) => ({
      streak: null,
      loading: false,

      // ======================
      // FETCH
      // ======================

      fetchStreak: async () => {
        if (get().loading) return;

        set({ loading: true });

        try {
          const data = await GetLastestMoment();

          if (data?.streak) {
            set({ streak: data.streak });
          }
        } catch (error) {
          console.error("❌ Error fetching streak:", error);
        } finally {
          set({ loading: false });
        }
      },

      // ======================
      // SYNC
      // ======================

      syncStreak: async () => {
        // persist đã tự load local rồi
        if (get().loading) return;

        set({ loading: true });

        try {
          const data = await GetLastestMoment();

          if (data?.streak) {
            set({ streak: data.streak });
          }
        } catch (error) {
          console.error("❌ Sync streak error:", error);
        } finally {
          set({ loading: false });
        }
      },

      // ======================
      // FETCH IF NEEDED
      // ======================

      fetchStreakIfNeeded: async () => {
        const { streak, loading } = get();

        if (loading) return;

        const today = formatYYYYMMDD();

        if (streak?.last_updated_yyyymmdd === today) {
          return;
        }

        set({ loading: true });

        try {
          const data = await GetLastestMoment();

          if (data?.streak) {
            set({ streak: data.streak });
          }
        } catch (error) {
          console.error("❌ Error fetching streak:", error);
        } finally {
          set({ loading: false });
        }
      },

      // ======================
      // CLEAR
      // ======================

      clearStreak: () => {
        set({ streak: null });
      },

      // ======================
      // HELPERS
      // ======================

      isStreakUpdatedToday: () => {
        const { streak } = get();

        return streak?.last_updated_yyyymmdd === formatYYYYMMDD();
      },

      getTodayIfNotUpdated: () => {
        const { streak } = get();

        const today = formatYYYYMMDD();

        if (streak?.last_updated_yyyymmdd === today) {
          return null;
        }

        return today;
      },
    }),
    {
      name: "streak-storage",

      partialize: (state) => ({
        streak: state.streak,
      }),
    },
  ),
);
