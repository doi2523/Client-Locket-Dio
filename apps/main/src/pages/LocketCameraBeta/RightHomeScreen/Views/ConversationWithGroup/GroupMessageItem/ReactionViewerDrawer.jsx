import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { useAuthStore } from "@/stores";
import { X } from "lucide-react";

export const ReactionViewerDrawer = ({
  open,
  reactions,
  friendMap,
  userInfoMap,
  onClose,
  onRemoveReaction,
}) => {
  const user = useAuthStore((s) => s.user);
  const me = localStorage.getItem("localId");
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setShow(false), 300);
    }
  }, [open]);

  const grouped = {};
  reactions?.forEach((r) => {
    if (!r?.emoji || !r?.user_id) return;
    if (!grouped[r.emoji]) grouped[r.emoji] = [];
    if (!grouped[r.emoji].includes(r.user_id)) {
      grouped[r.emoji].push(r.user_id);
    }
  });

  const getName = (uid) => {
    if (uid === me) return "Bạn";
    const detail = friendMap?.[uid] ?? userInfoMap?.[uid] ?? null;
    return detail
      ? `${detail.firstName} ${detail.lastName}`.trim()
      : uid?.slice(0, 8);
  };

  const getAvatar = (uid) => {
    if (uid === me) {
      return user?.profilePicture || user?.profile_pic || null;
    }
    const detail = friendMap?.[uid] ?? userInfoMap?.[uid] ?? null;
    return detail?.profilePic || null;
  };

  const getInitial = (uid) => {
    if (uid === me) {
      return (
        user?.firstName?.charAt(0)?.toUpperCase() ||
        user?.lastName?.charAt(0)?.toUpperCase() ||
        "B"
      );
    }
    const detail = friendMap?.[uid] ?? userInfoMap?.[uid] ?? null;
    return (
      detail?.firstName?.charAt(0)?.toUpperCase() ||
      uid?.charAt(0)?.toUpperCase() ||
      "?"
    );
  };

  if (!show) return null;

  return ReactDOM.createPortal(
    <div
      className={clsx(
        "fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62]",
        {
          "opacity-100": animate,
          "opacity-0 pointer-events-none": !animate,
        },
      )}
      onClick={onClose}
    >
      <div
        className={clsx(
          "fixed h-2/5 border-t border-base-300 bottom-0 left-0 w-full bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content overflow-hidden",
          {
            "translate-y-0": animate,
            "translate-y-full": !animate,
          },
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-base-300" />
        </div>
        <h3 className="text-sm font-bold text-center mb-1 shrink-0 text-base-content/70">
          Reactions
        </h3>
        <div className="overflow-y-auto px-5 pb-6">
          {Object.entries(grouped).map(([emoji, users]) => {
            const hasMe = users.includes(me);

            return (
              <div
                key={emoji}
                className="flex justify-between items-start gap-3 py-2.5 border-b border-base-200 last:border-0"
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  {users.map((uid) => {
                    const avatar = getAvatar(uid);

                    return (
                      <div key={uid} className="flex items-center gap-2">
                        {avatar ? (
                          <img
                            src={avatar}
                            className="w-10 h-10 rounded-full object-cover border border-base-300 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-[10px] font-bold text-base-content/70 shrink-0">
                            {getInitial(uid)}
                          </div>
                        )}

                        <span className="text-sm font-medium">
                          {getName(uid)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="relative flex flex-col items-center shrink-0">
                  <span className="text-3xl">{emoji}</span>

                  {hasMe && (
                    <button
                      className="absolute -top-2 -right-3 w-6 h-6 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-400 transition-colors"
                      onClick={() => onRemoveReaction(emoji)}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
};
