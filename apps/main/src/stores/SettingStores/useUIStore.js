import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  persist(
    (set) => ({
      // ===== STATE =====
      background: null,
      cameraFrame: null,
      primaryColor: "#ffffff",

      // ===== ACTIONS =====
      setBackground: (bg) => set({ background: bg }),

      setCameraFrame: (frame) => set({ cameraFrame: frame }),

      setPrimaryColor: (color) => set({ primaryColor: color }),

      resetUI: () =>
        set({
          background: null,
          cameraFrame: null,
          primaryColor: "#ffffff",
        }),
    }),
    {
      name: "locket-ui", // key trong localStorage
    }
  )
);
