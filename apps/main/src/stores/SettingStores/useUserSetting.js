import { updateAllowSearch } from "@/services";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserSetting = create(
  persist(
    (set, get) => ({
      // ===== STATE =====
      showSeenMoments: true,
      sendReadReceipts: true,
      allowSearch: true,

      // ===== ACTIONS =====
      toggleSeenMoments: () =>
        set((state) => ({
          showSeenMoments: !state.showSeenMoments,
        })),

      toggleReadReceipts: () =>
        set((state) => ({
          sendReadReceipts: !state.sendReadReceipts,
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
          sendReadReceipts: true,
          allowSearch: true,
        }),
    }),
    {
      name: "user-settings", // key trong localStorage
    },
  ),
);

// const showSeenMoments = useUserSetting((s) => s.showSeenMoments);
// const toggleSeenMoments = useUserSetting((s) => s.toggleSeenMoments);

// const allowSearch = useUserSetting((s) => s.allowSearch);
// const toggleAllowSearch = useUserSetting((s) => s.toggleAllowSearch);

export const useReadReceipts = () => {
  const sendReadReceipts = useUserSetting((s) => s.sendReadReceipts);
  const toggleReadReceipts = useUserSetting((s) => s.toggleReadReceipts);

  return {
    sendReadReceipts,
    toggleReadReceipts,
  };
};
