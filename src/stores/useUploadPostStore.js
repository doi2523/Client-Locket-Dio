import { create } from "zustand";
import {
  SonnerError,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import { PostMoments } from "@/services";
import { normalizeMoment } from "@/utils";
import { useStreakStore } from "@/stores";

import {
  saveUploadItemToDB,
  updateUploadItemInDB,
  deleteUploadItemFromDB,
  getUploadItemFromDB,
  loadUploadItemsByStatus,
  loadAllUploadItems,
  getPostedMoments,
  savePostedMomentToDB,
} from "../cache/uploadMomentDB";

export const STATUS_UPLOAD_MOMENT = {
  QUEUED: "queued",
  UPLOADING: "uploading",
  DONE: "done",
  FAILED: "failed",
};

export const useUploadQueueStore = create((set, get) => ({
  uploadItems: [],
  postedMoments: [],
  isQueueRunning: false,

  /* ================= INIT / LOAD ================= */

  hydrateUploadQueue: async () => {
    const items = await loadAllUploadItems();

    // sort mới → cũ cho UI
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    set({ uploadItems: items });

    const posted = await getPostedMoments();
    set({ postedMoments: posted });

    get().autoCleanupItem();
    // nếu còn queued thì chạy tiếp
    // if (items.some((i) => i.status === STATUS_UPLOAD_MOMENT.QUEUED)) {
    //   get().runQueue();
    // }
  },

  enqueueUploadItem: async (data) => {
    const item = {
      ...data,
      status: STATUS_UPLOAD_MOMENT.QUEUED,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ uploadItems: [item, ...s.uploadItems] }));
    await saveUploadItemToDB(item);
    get().runQueue();
  },

  retryUploadItem: async (itemId) => {
    get().updateUploadItem(itemId, {
      status: STATUS_UPLOAD_MOMENT.QUEUED,
      lastTried: new Date().toISOString(),
    });
    get().runQueue();
  },

  /* ================= WORKER ================= */

  runQueue: async () => {
    if (get().isQueueRunning) return;
    set({ isQueueRunning: true });

    try {
      let item;
      while (
        (item = (await loadUploadItemsByStatus(STATUS_UPLOAD_MOMENT.QUEUED))[0])
      ) {
        await get().uploadSingleItem(item);
      }
    } finally {
      set({ isQueueRunning: false });
    }
  },

  uploadSingleItem: async (item) => {
    get().updateUploadItem(item.id, {
      status: STATUS_UPLOAD_MOMENT.UPLOADING,
    });

    try {
      const res = await PostMoments(item);
      const normalized = normalizeMoment(res?.data);
      // ❗ Validate response
      if (!normalized || !normalized.id) {
        throw new Error("INVALID_UPLOAD_RESPONSE");
      }
      await get().savePostedMoment(item, normalized);

      get().updateUploadItem(item.id, {
        status: STATUS_UPLOAD_MOMENT.DONE,
      });

      SonnerSuccess(
        "Đăng tải thành công!",
        `${
          item.contentType === "video" ? "Video" : "Hình ảnh"
        } đã được tải lên!`
      );
      useStreakStore.getState().fetchStreakIfNeeded();

      get().autoCleanupItem(item.id);
    } catch (err) {
      // ❌ Response trả về không hợp lệ
      if (err?.message === "INVALID_UPLOAD_RESPONSE") {
        SonnerError("Đăng tải thất bại!", "Dữ liệu trả về không hợp lệ.");

        get().updateUploadItem(item.id, {
          status: STATUS_UPLOAD_MOMENT.FAILED,
          errorCode: "INVALID_RESPONSE",
          errorMessage: "Dữ liệu trả về không hợp lệ",
        });

        return;
      }

      // ⚠️ Bài đăng đã tồn tại
      if (err?.response?.status === 409) {
        get().updateUploadItem(item.id, {
          status: STATUS_UPLOAD_MOMENT.DONE,
        });

        await deleteUploadItemFromDB(item.id);
        SonnerWarning("Bài đăng đã tồn tại!");
        return;
      }

      // ❌ File / upload item không tồn tại
      if (err?.response?.status === 404) {
        SonnerError("File không tồn tại hoặc đã bị xoá");

        get().updateUploadItem(item.id, {
          status: STATUS_UPLOAD_MOMENT.FAILED,
          errorCode: "UPLOAD_ITEM_NOT_FOUND",
          errorMessage: "File không tồn tại hoặc đã bị xoá",
        });

        // await deleteUploadItemFromDB(item.id);
        return;
      }

      // ❌ Lỗi khác
      SonnerError("Đăng tải thất bại!");

      get().updateUploadItem(item.id, {
        status: STATUS_UPLOAD_MOMENT.FAILED,
        errorCode: "UPLOAD_FAILED",
        errorMessage:
          err?.response?.data?.message || "Đăng tải thất bại, vui lòng thử lại",
      });
    }
  },

  removeUploadItemById: async (id) => {
    if (!id) return;

    // xoá DB trước
    await deleteUploadItemFromDB(id);

    // xoá store
    set((state) => ({
      uploadItems: state.uploadItems.filter((item) => item.id !== id),
    }));
  },
  /* ================= CLEANUP ================= */

  autoCleanupItem: (itemId, delay = 3000) => {
    setTimeout(async () => {
      if (!itemId) return;
      const item = await getUploadItemFromDB(itemId);
      if (item?.status === STATUS_UPLOAD_MOMENT.DONE) {
        get().removeUploadItemById(itemId);
      }
    }, delay);
  },

  updateUploadItemInState: (id, patch) => {
    if (!id) return;

    set((state) => ({
      uploadItems: state.uploadItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  },

  updateUploadItem: async (id, patch) => {
    await updateUploadItemInDB(id, patch);
    get().updateUploadItemInState(id, patch);
  },

  savePostedMoment: async (payload, posted) => {
    try {
      await savePostedMomentToDB(payload, posted);

      set((state) => ({
        postedMoments: [
          {
            postId: posted.id,
            createdAt: new Date().toISOString(),
            contentType: payload.contentType,
            ...posted,
          },
          ...state.postedMoments,
        ],
      }));
    } catch (err) {
      console.error("❌ Failed to save posted moment:", err);
    }
  },
}));
