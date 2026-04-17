import { useUserSetting } from "@/stores";
import { Eye, UserRoundSearch, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const SettingPoup = ({ open, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showModal]);

  useEffect(() => {
    if (open) {
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setShowModal(false), 500);
    }
  }, [open]);

  const showSeenMoments = useUserSetting((s) => s.showSeenMoments);
  const toggleSeenMoments = useUserSetting((s) => s.toggleSeenMoments);

  const allowSearch = useUserSetting((s) => s.allowSearch);
  const toggleAllowSearch = useUserSetting((s) => s.toggleAllowSearch);

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62] text-base-content ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 w-full h-[70%] bg-base-100 rounded-t-4xl shadow-xl
        transition-all duration-300 ease-in-out z-[63] flex flex-col
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-base-300 px-4 py-3">
          <h3 className="text-xl font-semibold">Cài đặt</h3>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={onClose}
          >
            <X className="w-8 h-8 btn btn-circle p-1" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div>
            <p className="text-sm text-base-content/60 mb-2">Hiển thị</p>

            <div className="bg-base-200 rounded-2xl divide-y divide-base-300">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-base-300">
                    <Eye className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-medium">Trạng thái xem Moments</p>
                    <p className="text-sm text-base-content/60">
                      Khi bật, người khác sẽ biết bạn đã xem Moments của họ.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={showSeenMoments}
                  onChange={(e) => toggleSeenMoments()}
                  className="toggle toggle-secondary"
                />
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-base-300">
                    <UserRoundSearch className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="font-medium">Ẩn tìm kiếm</p>
                    <p className="text-sm text-base-content/60">
                      Cho phép người khác tìm thấy bạn bằng tên người dùng.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={allowSearch}
                  onChange={toggleAllowSearch}
                  className="toggle toggle-secondary"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SettingPoup;
