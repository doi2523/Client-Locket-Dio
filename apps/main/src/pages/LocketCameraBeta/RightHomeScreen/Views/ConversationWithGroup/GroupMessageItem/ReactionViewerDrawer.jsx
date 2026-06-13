import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const ReactionViewerDrawer = ({
  open,
  reactions,
  friendMap,
  userInfoMap,
  onClose,
  onRemoveReaction,
}) => {
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
    const detail = friendMap?.[uid] ?? userInfoMap?.[uid] ?? null;
    return detail?.profilePic || null;
  };

  const getInitial = (uid) => {
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
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62] ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed h-2/5 border-t border-base-300 bottom-0 left-0 w-full bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content overflow-hidden
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-base-300" />
        </div>
        <h3 className="text-sm font-bold text-center mb-1 shrink-0 text-base-content/70">
          Reactions
        </h3>
        <div className="overflow-y-auto px-4 pb-6">
          {Object.entries(grouped).map(([emoji, users]) => (
            <div
              key={emoji}
              className="flex justify-between items-start gap-3 py-2.5 border-b border-base-200 last:border-0"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                {users.map((uid) => {
                  const avatar = getAvatar(uid);
                  const isMeUid = uid === me;
                  return (
                    <div key={uid} className="flex items-center gap-2 w-full">
                      {avatar ? (
                        <img
                          src={avatar}
                          className="w-10 h-10 rounded-full object-cover border border-base-300 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-[10px] font-bold text-base-content/70 flex-shrink-0">
                          {getInitial(uid)}
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {getName(uid)}
                      </span>
                      {isMeUid && (
                        <button
                          className="ml-auto w-5 h-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-400 transition-colors flex-shrink-0"
                          onClick={() => onRemoveReaction(emoji)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-xl w-10 text-center flex-shrink-0">
                {emoji}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};
