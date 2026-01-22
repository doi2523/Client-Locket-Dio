import { X, Info } from "lucide-react";
import LoadingActivityItem from "./LoadingActivityItem";
import { formatFirestoreTime, formatTimeAgo } from "@/utils";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

// ================= Component: ActivityModal =================
export const ActivityModal = ({
  show,
  onClose,
  activity,
  isLoading,
  activeTooltip,
  setActiveTooltip,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Lock scroll khi mở modal
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Xử lý mở/đóng modal với animation
  useEffect(() => {
    if (show) {
      // Mở modal với animation
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      // Đóng modal với animation
      setAnimate(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [show]);

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-60 flex items-end bg-base-100/30 backdrop-blur-[4px] duration-500 transition-all ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full h-2/3 bg-base-100 rounded-t-3xl shadow-lg p-4 transform transition-transform duration-500 border-t border-base-300 ${
          animate ? "translate-y-0" : "translate-y-full"
        } flex flex-col`}
      >
        {/* Header - fixed */}
        <div className="sticky top-0 z-10 border-b border-gray-200 pb-3 dark:border-gray-700">
          <div className="relative flex items-center">
            <h2 className="text-lg font-bold text-center flex-1 text-base-content">
              Hoạt động
            </h2>
            <button
              onClick={onClose}
              className="absolute right-0 p-2 rounded-full text-base-content"
            >
              <X className="w-6 h-6 text-base-content" />
            </button>
          </div>

          {/* Tổng kết */}
          {!isLoading && activity.length > 0 && (
            <div className="mt-3 text-sm text-base-content space-y-1">
              <p>
                - 👁️ Tổng người xem:{" "}
                <span className="font-semibold">
                  {activity.filter((i) => i.viewedAt).length}
                </span>
              </p>
              <p>
                - 💖 Tổng người đã thả cảm xúc:{" "}
                <span className="font-semibold">
                  {activity.filter((i) => i.reaction).length}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <ul className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <LoadingActivityItem key={i} />
              ))}
            </ul>
          ) : activity.length > 0 ? (
            <ul className="space-y-2">
              {activity.map((item) => (
                <li
                  key={item?.user?.uid}
                  className="flex items-center gap-3 relative"
                >
                  <img
                    src={item?.user?.profilePic}
                    alt={item?.user?.firstName}
                    className="w-12 h-12 rounded-full border-[2.5px] p-0.5 border-amber-400"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-base text-base-content font-semibold">
                      {item.user?.firstName} {item.user?.lastName}
                    </span>
                    {item.reaction ? (
                      <span className="text-sm">
                        đã reaction {item?.reaction?.emoji}{" "}
                        {formatTimeAgo(item?.reaction?.createdAt)}
                      </span>
                    ) : (
                      <span className="text-sm">
                        ✨ đã xem {formatFirestoreTime(item?.viewedAt)}
                      </span>
                    )}
                  </div>

                  {/* Info button */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveTooltip(
                          activeTooltip === item?.user?.uid
                            ? null
                            : item?.user?.uid
                        )
                      }
                      className="p-2 rounded-full hover:bg-base-200 transition-colors"
                    >
                      <Info className="w-5 h-5 text-base-content/60" />
                    </button>

                    {/* Tooltip */}
                    {activeTooltip === item?.user?.uid && (
                      <div className="absolute right-6 top-full mt-2 w-64 bg-base-200 rounded-lg shadow-xl p-3 z-50 border border-base-300">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 pb-2 border-b border-base-300">
                            <img
                              src={item?.user?.profilePic}
                              alt={item?.user?.firstName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-semibold">
                                {item.user?.firstName} {item.user?.lastName}
                              </p>
                              <p className="text-xs text-base-content/60">
                                @{item.user?.username || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-xs text-base-content/70">
                              <span className="font-medium">User ID:</span>{" "}
                              {item.user?.uid}
                            </p>

                            {item.viewedAt && (
                              <p className="text-xs text-base-content/70">
                                <span className="font-medium">
                                  Thời gian xem:
                                </span>
                                <br />
                                {formatFirestoreTime(item.viewedAt)}
                              </p>
                            )}

                            {item.reaction && (
                              <>
                                <p className="text-xs text-base-content/70">
                                  <span className="font-medium">Cảm xúc:</span>{" "}
                                  {item.reaction.emoji}
                                </p>
                                <p className="text-xs text-base-content/70">
                                  <span className="font-medium">Cường độ:</span>{" "}
                                  {item.reaction.intensity || 0}
                                </p>
                                <p className="text-xs text-base-content/70">
                                  <span className="font-medium">
                                    Thời gian reaction:
                                  </span>
                                  <br />
                                  {new Date(
                                    item.reaction.createdAt
                                  ).toLocaleString("vi-VN")}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/60 italic">
              Chưa có hoạt động nào
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
