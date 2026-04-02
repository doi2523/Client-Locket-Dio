import { usePostStore, useOverlayEditorStore } from "@/stores";

export const resetAllPostData = () => {
  usePostStore.getState().resetPostStore();
  useOverlayEditorStore.getState().resetOverlayEditor();
};
