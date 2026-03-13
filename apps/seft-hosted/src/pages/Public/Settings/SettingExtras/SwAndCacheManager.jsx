import { CONFIG } from "@/config";
import { useEffect, useState } from "react";

export default function SwManager() {
  const [usage, setUsage] = useState(0);
  const [quota, setQuota] = useState(0);

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;
    const mb = kb / 1024;

    if (mb >= 1) return mb.toFixed(2) + " MB";
    return kb.toFixed(2) + " KB";
  };

  const getStorageInfo = async () => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      setUsage(estimate.usage || 0);
      setQuota(estimate.quota || 0);
    }
  };

  useEffect(() => {
    getStorageInfo();
  }, []);

  const handleUpdate = () => {
    if (!("serviceWorker" in navigator)) {
      alert("Trình duyệt không hỗ trợ Service Worker.");
      return;
    }

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) {
        alert("Chưa đăng ký service worker!");
        return;
      }

      registration.update().then(() => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });

          navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
          });
        } else {
          alert("Đã là phiên bản mới nhất!");
        }
      });
    });
  };

  const handleUnregisterSW = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
        alert("Đã huỷ đăng ký tất cả service workers!");
      });
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm("Bạn có chắc muốn xoá toàn bộ cache trình duyệt?"))
      return;

    localStorage.clear();
    sessionStorage.clear();

    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }

    // clear indexeddb
    await clearIndexedDB();

    alert("Đã xoá cache!");
    getStorageInfo();
  };

  const clearIndexedDB = async () => {
    if (!("indexedDB" in window)) return;

    const databases = await indexedDB.databases();

    await Promise.all(
      databases.map((db) => {
        return new Promise((resolve) => {
          const request = indexedDB.deleteDatabase(db.name);
          request.onsuccess = resolve;
          request.onerror = resolve;
          request.onblocked = resolve;
        });
      }),
    );
  };

  const percent = quota ? Math.round((usage / quota) * 100) : 0;

  return (
    <div className="flex-1 bg-base-100 rounded-lg p-5 shadow-sm flex flex-col gap-5">
      <h3 className="font-semibold text-lg text-center">
        Quản lý Cache & Service Worker
      </h3>

      {/* VERSION */}
      <div className="text-sm text-base-content space-y-1">
        <p>
          Client version:{" "}
          <span className="font-mono underline font-semibold">
            {CONFIG.app.clientVersion}
          </span>
        </p>
        <p>
          API version:{" "}
          <span className="font-mono underline font-semibold">
            {CONFIG.app.apiVersion}
          </span>
        </p>
      </div>

      {/* UPDATE */}
      <button
        onClick={handleUpdate}
        className="btn btn-primary w-full"
        type="button"
      >
        Tải phiên bản mới
      </button>

      {/* STORAGE */}
      <div className="bg-base-200 rounded-lg p-4 text-sm space-y-2">
        <p className="font-medium">Dung lượng lưu trữ cục bộ:</p>

        <progress
          className="progress progress-primary w-full"
          value={usage}
          max={quota}
        ></progress>

        <p>
          Đã sử dụng: <span className="font-mono">{formatSize(usage)}</span>
        </p>
        <p>
          Giới hạn: <span className="font-mono">{formatSize(quota)}</span>
        </p>
        <p className="text-xs opacity-70">({percent}% dung lượng)</p>
      </div>

      <p className="text-sm text-warning">
        Không nên xoá nếu không cần thiết vì bạn sẽ mất toàn bộ dữ liệu đã lưu
        trên web.
      </p>

      {/* CLEAR CACHE */}
      <button
        onClick={handleClearCache}
        className="btn btn-warning w-full"
        type="button"
      >
        Xoá Cache
      </button>

      {/* ADVANCED */}
      <div className="border-t pt-4">
        <button
          onClick={handleUnregisterSW}
          className="btn btn-secondary w-full opacity-60 cursor-not-allowed"
          type="button"
          disabled
        >
          Huỷ đăng ký Service Worker
        </button>
      </div>
    </div>
  );
}
