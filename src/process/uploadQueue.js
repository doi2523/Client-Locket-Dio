import {
  SonnerError,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import { PostMoments } from "@/services";
import { normalizeMoment } from "@/utils";
import { fetchStreak } from "@/utils/SyncData/streakUtils";
import Dexie from "dexie";

// ===== DB setup =====
const db = new Dexie("UploadMomentsDB");
db.version(1).stores({
  payloads: "++id, createdAt, status",
  postedMoments: "++id, postId, createdAt",
});

// ===== Producer: thêm payload vào queue =====
export const enqueuePayload = async (payload, setStreak) => {
  const id = await db.payloads.add({
    ...payload,
    status: "queued",
    createdAt: new Date().toISOString(),
  });

  // Gọi consumer ngay sau khi thêm
  processQueue(setStreak);
  return id;
};

export const enRetryPayload = async (payload, setStreak) => {
  if (payload.id) {
    // Nếu đã có id, cập nhật payload để retry
    await db.payloads.update(payload.id, {
      ...payload,
      status: "retrying",
      lastTried: new Date().toISOString(),
    });
  } else {
    // Nếu chưa có id, thêm mới
    const id = await db.payloads.add({
      ...payload,
      status: "retrying",
      lastTried: new Date().toISOString(),
    });
    payload.id = id; // gán id mới
  }

  // Gọi consumer ngay sau khi thêm hoặc update
  processRetryQueue(setStreak);

  return payload.id;
};

// ===== Xóa payload theo id =====
export const deletePayloadById = async (id) => {
  try {
    const deleted = await db.payloads.delete(id);
    console.log(`✅ Payload với id ${id} đã bị xóa`);
  } catch (err) {
    console.error(`❌ Lỗi khi xóa payload với id ${id}:`, err);
  }
};

// ===== Lấy payload theo id =====
export const getPayloadById = async (id) => {
  try {
    const payload = await db.payloads.get(id);
    if (!payload) {
      console.warn(`⚠️ Không tìm thấy payload với id ${id}`);
      return null;
    }
    return payload;
  } catch (err) {
    console.error(`❌ Lỗi khi lấy payload với id ${id}:`, err);
    return null;
  }
};

// ===== Hàm update status =====
export const updatePayloadStatus = async (id, status) => {
  try {
    const updated = await db.payloads.update(id, { status });
    if (updated === 0) {
      console.warn(`⚠️ Không tìm thấy payload với id: ${id}`);
    } else {
      console.log(
        `✅ Payload ${id} được cập nhật trạng thái thành "${status}"`
      );
    }
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật trạng thái payload:", err);
  }
};

// ===== Hàm lấy danh sách payload =====
export const getQueuePayloads = async (filterStatus = null) => {
  try {
    let collection = db.payloads.toCollection();

    // Nếu có filter trạng thái
    if (filterStatus) {
      collection = db.payloads.where("status").equals(filterStatus);
    }

    // Sắp xếp theo thời gian tạo tăng dần
    const payloads = await collection.sortBy("createdAt");
    return payloads;
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách payload:", err);
    return [];
  }
};

// ===== Consumer: xử lý payload theo queue =====
let isProcessingQueue = false;

export const processQueue = async (setStreak) => {
  if (isProcessingQueue) return; // tránh chạy đồng thời
  isProcessingQueue = true;

  try {
    const queuedPayloads = await db.payloads
      .where("status")
      .equals("queued")
      .sortBy("createdAt");

    for (const payload of queuedPayloads) {
      try {
        // Cập nhật trạng thái đang xử lý
        await updatePayloadStatus(payload.id, "processing");

        // ===== Xử lý payload =====
        const response = await PostMoments(payload);
        const normalizedNewData = normalizeMoment(response?.data);

        savePostedMoment(payload, normalizedNewData);
        // Nếu thành công
        await updatePayloadStatus(payload.id, "done");
        SonnerSuccess(
          "Đăng tải thành công!",
          `${
            payload.contentType === "video" ? "Video" : "Hình ảnh"
          } đã được tải lên!`
        );
        await fetchStreak(setStreak);

        // ✅ Tự động xóa sau 3 giây
        deleteDonePayloadAfterDelay(payload.id, 3000);
      } catch (err) {
        console.error("❌ Lỗi khi upload:", err);
        // Bỏ qua bài này, tiếp bài tiếp theo
        await updatePayloadStatus(payload.id, "failed");
        SonnerError(
          "Đăng tải thất bại!",
          `Không thể tải ${
            payload.contentType === "video" ? "video" : "ảnh"
          } lên. Bài tiếp theo sẽ được xử lý.`
        );
      }
    }
  } finally {
    isProcessingQueue = false;
  }
};

let isProcessingRetryQueue = false;

export const processRetryQueue = async (setStreak) => {
  if (isProcessingRetryQueue) return; // tránh chạy đồng thời
  isProcessingRetryQueue = true;

  try {
    const queuedPayloads = await db.payloads
      .where("status")
      .equals("retrying")
      .sortBy("lastTried");

    for (const payload of queuedPayloads) {
      try {
        // Cập nhật trạng thái đang xử lý
        await updatePayloadStatus(payload.id, "processing");

        // ===== Xử lý payload =====
        const response = await PostMoments(payload);
        const normalizedNewData = normalizeMoment(response?.data);

        savePostedMoment(payload, normalizedNewData);

        // Nếu thành công
        await updatePayloadStatus(payload.id, "done");
        SonnerSuccess(
          "Đăng tải thành công!",
          `${
            payload.contentType === "video" ? "Video" : "Hình ảnh"
          } đã được tải lên!`
        );
        // await
        await fetchStreak(setStreak);

        // ✅ Tự động xóa sau 3 giây
        deleteDonePayloadAfterDelay(payload.id, 3000);
      } catch (err) {
        console.error("❌ Lỗi khi upload:", err);

        // Nếu lỗi 409: xóa payload
        const errorCode = err?.response?.status;
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.error?.message;
        if (errorCode === 409) {
          await deletePayloadById(payload.id);
          SonnerWarning(
            "Bài đăng đã được xử lý!",
            message || "Bài đăng này đã được xử lý trước đó."
          );
        } else {
          // Các lỗi khác: đánh dấu failed
          await updatePayloadStatus(payload.id, "failed");
        }

        SonnerError(
          "Thử lại thất bại!",
          `Không thể tải ${
            payload.contentType === "video" ? "video" : "ảnh"
          } lên. Vui lòng thử lại sau.`
        );
      }
    }
  } finally {
    isProcessingRetryQueue = false;
  }
};

const deleteDonePayloadAfterDelay = async (payloadId, delay = 3000) => {
  setTimeout(async () => {
    const payload = await getPayloadById(payloadId);
    if (payload?.status === "done") {
      await deletePayloadById(payloadId);
    }
  }, delay);
};

// ===== Lưu payload đã đăng thành công =====
export const savePostedMoment = async (payload, posted) => {
  try {
    await db.postedMoments.add({
      postId: posted?.id || null,
      createdAt: new Date().toISOString(),
      contentType: payload.contentType,
      ...posted,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lưu postedMoment:", err);
  }
};

// ===== Lấy danh sách các post đã đăng =====
export const getPostedMoments = async () => {
  try {
    return await db.postedMoments.orderBy("createdAt").reverse().toArray();
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách postedMoments:", err);
    return [];
  }
};
