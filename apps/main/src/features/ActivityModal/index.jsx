import { X, Info } from "lucide-react";
import LoadingActivityItem from "./LoadingActivityItem";
import { formatFirestoreTime, formatTimeAgo } from "@/utils";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

export const ActivityModal = ({
  show,
  onClose,
  activity,
  isLoading,
  pollCounts,
  activeTooltip,
  setActiveTooltip,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  useEffect(() => {
    if (show) {
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [show]);

  const viewerCount = activity.filter((i) => i.viewedAt).length;
  const reactorCount = activity.filter((i) => i.reactions?.length > 0).length;

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-60 flex items-end bg-base-100/30 backdrop-blur-[4px] duration-500 transition-all ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative flex h-2/3 w-full transform flex-col rounded-t-3xl border-t border-base-300 bg-base-100 p-4 text-base-content shadow-lg transition-transform duration-500 ${
          animate ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 z-10 border-b border-base-300">
          <div className="relative flex items-center">
            <h2 className="flex-1 text-center text-lg font-bold">Hoạt động</h2>
            <button
              onClick={onClose}
              className="absolute right-0 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!isLoading && activity.length > 0 && (
            <div className="mt-3 space-y-1 text-sm">
              <p>
                - 👁️ Tổng người xem:{" "}
                <span className="font-semibold">{viewerCount}</span>
              </p>
              <p>
                - 💖 Người đã thả cảm xúc:{" "}
                <span className="font-semibold">{reactorCount}</span>
              </p>
              {pollCounts?.isPoll && (
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  <span>📊 Poll:</span>
                  <span className="rounded-full bg-base-200 px-2 py-0.5 tabular-nums">
                    {pollCounts.leftEmoji} {pollCounts.leftCount}
                  </span>
                  <span className="rounded-full bg-base-200 px-2 py-0.5 tabular-nums">
                    {pollCounts.rightEmoji} {pollCounts.rightCount}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-1 flex-1 overflow-y-auto">
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
                  className="relative flex items-center gap-3"
                >
                  <img
                    src={item?.user?.profilePic || item?.user?.profilePicture}
                    alt={item?.user?.firstName}
                    className="h-12 w-12 rounded-full border-[2.5px] border-amber-400 p-0.5"
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="text-base font-semibold">
                      {item.user?.firstName} {item.user?.lastName}
                    </span>
                    {item.reaction ? (
                      <span className="text-sm">
                        đã reaction {item.reaction.emoji}{" "}
                        {formatTimeAgo(item.reaction.createdAt)}
                      </span>
                    ) : item.viewedAt ? (
                      <span className="text-sm">
                        ✨ đã xem {formatFirestoreTime(item.viewedAt)}
                      </span>
                    ) : null}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveTooltip(
                          activeTooltip === item?.user?.uid
                            ? null
                            : item?.user?.uid,
                        )
                      }
                      className="rounded-full p-2 transition-colors hover:bg-base-200"
                    >
                      <Info className="h-5 w-5 text-base-content/60" />
                    </button>

                    {activeTooltip === item?.user?.uid && (
                      <div className="absolute right-6 top-full z-50 mt-2 w-64 rounded-lg border border-base-300 bg-base-200 p-3 shadow-xl">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 border-b border-base-300 pb-2">
                            <img
                              src={
                                item?.user?.profilePic ||
                                item?.user?.profilePicture
                              }
                              alt={item?.user?.firstName}
                              className="h-10 w-10 rounded-full"
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

                            {item.reactions?.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-base-content/70">
                                  Cảm xúc ({item.reactions.length}):
                                </p>
                                {item.reactions.map((r) => (
                                  <p
                                    key={r.id ?? `${r.emoji}-${r.createdAt}`}
                                    className="text-xs text-base-content/70"
                                  >
                                    {r.emoji} · cường độ {r.intensity || 0} ·{" "}
                                    {new Date(r.createdAt).toLocaleString(
                                      "vi-VN",
                                    )}
                                  </p>
                                ))}
                              </div>
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
            <div className="flex h-full items-center justify-center italic text-base-content/60">
              Chưa có hoạt động nào
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
