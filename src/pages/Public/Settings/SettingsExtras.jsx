import { showWarning } from "../../../components/Toast";
import { API_VERSION, CLIENT_VERSION } from "../../../constants/versionInfo";

export default function SettingsExtras() {
  const handleUpdate = () => {
    if ("serviceWorker" in navigator) {
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
    } else {
      alert("Trình duyệt không hỗ trợ Service Worker.");
    }
  };

  const handleClearCache = () => {
    if (!window.confirm("Bạn có chắc muốn xoá cache trình duyệt?")) return;
    localStorage.clear();
    sessionStorage.clear();
    alert("Đã xoá cache trình duyệt!");
  };

  const handleUnregisterSW = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
        alert("Đã huỷ đăng ký tất cả service workers!");
      });
    } else {
      alert("Trình duyệt không hỗ trợ Service Worker.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold font-lovehouse text-center mb-4 select-none">
        Extensive settings
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Cập nhật & SW */}
        <div className="flex-1 bg-base-100 rounded-lg p-4 shadow-sm flex flex-col items-center gap-4">
          <div className="w-full text-left space-y-5">
            <h3 className="font-semibold text-lg mb-2 text-center">
              Quản lý cập nhật & Service Worker
            </h3>
            <button
              onClick={handleUpdate}
              className="btn btn-primary w-full"
              type="button"
            >
              Tải lại phiên bản mới
            </button>
            <div className="relative space-y-0.5 text-xs text-gray-700">
              <p>
                Số phiên bản: <span className="font-mono underline font-semibold">{CLIENT_VERSION}</span>
              </p>
              <p>
                API version: <span className="font-mono underline font-semibold">{API_VERSION}</span>
              </p>
            </div>
            <button
              onClick={handleUnregisterSW}
              className="btn btn-accent w-full opacity-50 cursor-not-allowed"
              type="button"
              disabled
            >
              Huỷ đăng ký service worker
            </button>
          </div>
        </div>

        {/* Cache & API */}
        <div className="flex-1 bg-base-100 rounded-lg p-4 shadow-sm flex flex-col items-center gap-4">
          <h3 className="font-semibold text-lg mb-1 w-full text-center">
            Quản lý Cache & Cấu hình API
          </h3>

          <button
            onClick={handleClearCache}
            className="btn btn-warning w-full max-w-xs"
            type="button"
          >
            Xoá Cache
          </button>

          <div className="flex flex-row gap-3 items-center w-full max-w-xs">
            <input
              type="text"
              placeholder="Nhập API endpoint..."
              className="input input-bordered flex-grow max-w-full"
            />
            <button
              onClick={() => showWarning("Lưu cấu hình API (demo)")}
              className="btn btn-secondary whitespace-nowrap"
              type="button"
              disabled
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
