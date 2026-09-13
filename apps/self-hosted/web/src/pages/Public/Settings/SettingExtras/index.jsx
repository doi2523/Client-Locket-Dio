import { SonnerInfo } from "@/components/ui/SonnerToast";
import { Wrench } from "lucide-react";
import SwManager from "./SwAndCacheManager";
import PermissionsManager from "./PermissionsManager";

export default function SettingsExtras() {

  return (
    <div>
      <div className="flex items-center mb-4 text-base-content">
        <Wrench className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-semibold">Extensive settings</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Cập nhật & SW */}
        <SwManager />

        <PermissionsManager />

        {/* API */}
        <div className="flex-1 bg-base-100 rounded-lg p-4 shadow-sm flex flex-col items-center gap-4">
          <h3 className="font-semibold text-lg mb-1 w-full text-center">
            Quản lý Cache & Cấu hình API
          </h3>
          <div className="flex flex-row gap-3 items-center w-full max-w-xs">
            <input
              type="text"
              placeholder="Nhập API endpoint..."
              className="input input-bordered flex-grow max-w-full"
            />
            <button
              onClick={() => SonnerInfo("Lưu cấu hình API (demo)")}
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
