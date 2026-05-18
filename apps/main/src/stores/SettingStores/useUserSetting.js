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
      shareHistoryOn: false,
      autoUpdateStreak: true,

      // ===== ACTIONS =====
      toggleSeenMoments: () =>
        set((state) => ({
          showSeenMoments: !state.showSeenMoments,
        })),

      toggleReadReceipts: () =>
        set((state) => ({
          sendReadReceipts: !state.sendReadReceipts,
        })),

      toggleShareHistoryOn: () =>
        set((state) => ({
          shareHistoryOn: !state.shareHistoryOn,
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
          shareHistoryOn: false,
          autoUpdateStreak: true,
        }),
    }),
    {
      name: "user-settings",
      version: 1,

      migrate: (persistedState) => {
        return persistedState;
      },
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    },
  ),
);

// ===== Hooks =====

export const useReadReceipts = () => {
  const sendReadReceipts = useUserSetting((s) => s.sendReadReceipts);
  const toggleReadReceipts = useUserSetting((s) => s.toggleReadReceipts);

  return {
    sendReadReceipts,
    toggleReadReceipts,
  };
};

export const useShareHistory = () => {
  const shareHistoryOn = useUserSetting((s) => s.shareHistoryOn);

  const toggleShareHistoryOn = useUserSetting((s) => s.toggleShareHistoryOn);

  return {
    shareHistoryOn,
    toggleShareHistoryOn,
  };
};

// ===== Example =====

// const shareHistoryOn = useUserSetting(
//   (s) => s.shareHistoryOn
// );

// const toggleShareHistoryOn =
//   useUserSetting(
//     (s) => s.toggleShareHistoryOn
//   );
