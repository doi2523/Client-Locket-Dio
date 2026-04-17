import { updateAllowSearch } from "@/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserSetting = create(
  persist(
    (set, get) => ({
      // ===== STATE =====
      showSeenMoments: true,
      allowSearch: true,

      // ===== ACTIONS =====
      toggleSeenMoments: () =>
        set((state) => ({
          showSeenMoments: !state.showSeenMoments,
        })),

      toggleAllowSearch: async () => {
        const prev = get().allowSearch;
        const next = !prev;

        // 🚀 Optimistic update
        set({ allowSearch: next });

        try {
          await updateAllowSearch(next);
        } catch (err) {
          console.error("❌ Update failed:", err);

          // ❗ rollback nếu lỗi
          set({ allowSearch: prev });
        }
      },

      resetSettings: () =>
        set({
          showSeenMoments: true,
          allowSearch: true,
        }),
    }),
    {
      name: "user-settings", // key trong localStorage
    },
  ),
);
