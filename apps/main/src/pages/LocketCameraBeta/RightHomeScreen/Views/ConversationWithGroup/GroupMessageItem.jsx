import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { useFriendStoreV3, useUserInfoStore, useMessagesStore } from "@/stores";
import { OverlayRendererV2 } from "@/components/OverlayRender";
import { reactToGroupMessage, removeGroupMessageReaction } from "@/services";
import { SonnerInfo } from "@/components/ui/SonnerToast";

const QUICK_EMOJIS = ["❤️", "😂", "😍", "😢", "👍"];

const EMOJI_GRID = [
  "❤️", "😂", "😍", "😢", "👍", "🔥", "🎉", "💯",
  "😊", "😁", "🤣", "😅", "🥰", "😘", "😎", "🙏",
  "😡", "💀", "🤡", "👀", "💪", "✨", "🥺", "😭",
  "😤", "🤔", "🙄", "😴", "🤩", "😇", "🤗", "🫡",
  "👎", "💔", "🍆", "💦",
];

const ReactionViewerDrawer = ({ open, reactions, friendMap, userInfoMap, onClose, onRemoveReaction }) => {
  const me = localStorage.getItem("localId");
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
  reactions.forEach((r) => {
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
    return detail?.firstName?.charAt(0)?.toUpperCase() || uid?.charAt(0)?.toUpperCase() || "?";
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
        className={`fixed h-fit max-h-[50%] border-t border-base-300 bottom-0 left-0 w-full bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content overflow-hidden
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-base-300" />
        </div>
        <h3 className="text-sm font-bold text-center mb-1 shrink-0 text-base-content/70">Reactions</h3>
        <div className="overflow-y-auto px-4 pb-6">
          {Object.entries(grouped).map(([emoji, users]) => (
            <div key={emoji} className="flex items-start gap-3 py-2.5 border-b border-base-200 last:border-0">
              <span className="text-xl w-8 text-center flex-shrink-0">{emoji}</span>
              <div className="flex flex-col gap-1.5 flex-1">
                {users.map((uid) => {
                  const avatar = getAvatar(uid);
                  const isMeUid = uid === me;
                  return (
                    <div key={uid} className="flex items-center gap-2 w-full">
                      {avatar ? (
                        <img src={avatar} className="w-6 h-6 rounded-full object-cover border border-base-300 flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-[10px] font-bold text-base-content/70 flex-shrink-0">
                          {getInitial(uid)}
                        </div>
                      )}
                      <span className="text-sm font-medium">{getName(uid)}</span>
                      {isMeUid && (
                        <button
                          className="ml-auto w-5 h-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-400 transition-colors flex-shrink-0"
                          onClick={() => onRemoveReaction(emoji)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

const MomentContent = ({ moment }) => {
  if (!moment?.thumbnail_url) return null;
  return (
    <div className="mt-2">
      <div className="relative rounded-4xl overflow-hidden border border-base-300">
        <img src={moment.thumbnail_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <OverlayRendererV2 overlays={moment.overlays} />
        </div>
      </div>
    </div>
  );
};

const GroupMessageItem = ({ msg }) => {
  const me = localStorage.getItem("localId");
  const isMe = msg.user_id === me;

  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef(null);
  const holdTimerRef = useRef(null);
  const isLongPress = useRef(false);

  const friendMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const userInfoMap = useUserInfoStore((s) => s.userInfoMap);
  const ensureUserInfo = useUserInfoStore((s) => s.ensureUserInfo);
  const updateGroupMessageReaction = useMessagesStore((s) => s.updateGroupMessageReaction);

  const senderDetail = friendMap?.[msg.user_id] ?? userInfoMap?.[msg.user_id] ?? null;
  const senderName = isMe
    ? "Bạn"
    : senderDetail
      ? `${senderDetail.firstName} ${senderDetail.lastName}`
      : msg.user_id?.slice(0, 8) || "Thành viên nhóm";

  const avatarUrl = senderDetail?.profilePic || "/default-avatar.png";

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(Number(ts)).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const content = msg.content || {};
  const isSystemMessage =
    content.type === "userAddedToGroup" ||
    content.type === "userRemovedFromGroup" ||
    content.type === "groupNameChanged" ||
    content.type === "groupImageChanged";

  const actorUid = content.added_by_user_id || msg.user_id;
  const targetUid = isSystemMessage ? content.user_id : null;

  useEffect(() => {
    const unknowns = [];
    if (actorUid && actorUid !== me && !friendMap?.[actorUid] && !userInfoMap?.[actorUid]) unknowns.push(actorUid);
    if (targetUid && targetUid !== me && !friendMap?.[targetUid] && !userInfoMap?.[targetUid]) unknowns.push(targetUid);
    if (!isMe && !senderDetail) unknowns.push(msg.user_id);
    if (unknowns.length > 0) unknowns.forEach((uid) => ensureUserInfo(uid));
  }, [msg.id, actorUid, targetUid]);

  const getName = (uid) => {
    if (!uid) return null;
    if (uid === me) return "Bạn";
    const detail = friendMap?.[uid] ?? userInfoMap?.[uid] ?? null;
    if (detail?.firstName) return `${detail.firstName} ${detail.lastName}`.trim();
    return null;
  };

  const myReaction = msg.reactions?.find((r) => r.user_id === me)?.emoji || null;

  const sendReaction = useCallback(async (emoji) => {
    const existing = msg.reactions?.find((r) => r.user_id === me);

    if (existing?.emoji === emoji) {
      updateGroupMessageReaction(msg.uid, msg.id, me, null, "reactionRemoved");
      removeGroupMessageReaction({ groupId: msg.uid, messageId: msg.id }).catch(console.error);
    } else {
      updateGroupMessageReaction(msg.uid, msg.id, me, emoji, "reactionAdded");
      reactToGroupMessage({ groupId: msg.uid, messageId: msg.id, emoji }).catch(console.error);
    }

    setShowMenu(false);
    setShowEmojiPicker(false);
  }, [msg, me, updateGroupMessageReaction]);

  const showContextMenu = useCallback((x, y) => {
    setMenuPos({ x, y });
    setShowEmojiPicker(false);
    setShowMenu(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    if (isMe) return;
    isLongPress.current = false;
    holdTimerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (bubbleRef.current) {
        const rect = bubbleRef.current.getBoundingClientRect();
        showContextMenu(isMe ? rect.right : rect.left, rect.top);
      }
    }, 400);
  }, [isMe, showContextMenu]);

  const handleTouchMove = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (isLongPress.current) {
      e.preventDefault();
      isLongPress.current = false;
    }
  }, []);

  const handleContextMenu = useCallback((e) => {
    if (isMe) return;
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  }, [isMe, showContextMenu]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  if (isSystemMessage) {
    const actorName = getName(actorUid);
    const targetName = getName(targetUid);

    let sysText = "";
    if (content.type === "userAddedToGroup") {
      sysText = actorName
        ? targetName ? `${actorName} đã thêm ${targetName} vào nhóm` : `${actorName} đã thêm thành viên vào nhóm`
        : targetName ? `Đã thêm ${targetName} vào nhóm` : "Đã thêm thành viên vào nhóm";
    } else if (content.type === "userRemovedFromGroup") {
      sysText = actorName
        ? targetName ? `${actorName} đã xoá ${targetName} khỏi nhóm` : `${actorName} đã xoá thành viên khỏi nhóm`
        : targetName ? `Đã xoá ${targetName} khỏi nhóm` : "Đã xoá thành viên khỏi nhóm";
    } else if (content.type === "groupNameChanged") {
      sysText = actorName ? `${actorName} đã đổi tên nhóm thành "${content.name || ""}"` : `Đã đổi tên nhóm thành "${content.name || ""}"`;
    } else if (content.type === "groupImageChanged") {
      sysText = actorName ? `${actorName} đã thay đổi ảnh đại diện nhóm` : "Đã thay đổi ảnh đại diện nhóm";
    }
    return (
      <div className="text-center text-[11px] text-base-content/50 font-semibold py-2">{sysText}</div>
    );
  }

  const renderBody = () => {
    if (content.type === "moment") {
      return <MomentContent moment={content.moment} />;
    }
    if (content.type === "text" || !content.type) {
      return (
        <>
          {content.content && <span className="break-words text-sm">{content.content}</span>}
          {content.moment && <MomentContent moment={content.moment} />}
        </>
      );
    }
    return null;
  };

  return (
    <div className={`chat ${isMe ? "chat-end" : "chat-start"}`} key={msg.id}>
      {!isMe && (
        <div className="chat-image avatar">
          <div className="w-8 h-8 rounded-full border border-base-300">
            <img src={avatarUrl} alt={senderName} />
          </div>
        </div>
      )}

      {!isMe && (
        <div className="chat-header text-[10px] font-semibold opacity-70 mb-1 ml-1">
          {senderName}
        </div>
      )}

      <div
        ref={bubbleRef}
        className="chat-bubble relative bg-base-200 text-base-content font-medium rounded-2xl max-w-xs md:max-w-md select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onContextMenu={handleContextMenu}
      >
        {msg.reply_moment && (
          <div className="text-xs italic opacity-75 mb-1 text-primary">↪ Đã phản hồi khoảnh khắc</div>
        )}

        {renderBody()}

        {msg.reactions && msg.reactions.length > 0 && (
          <div
            className="absolute -bottom-2 -right-1 flex gap-0.5 bg-base-300 px-1 py-0.5 rounded-full shadow text-[15px] cursor-pointer z-10"
            onClick={(e) => { e.stopPropagation(); setShowReactions(true); }}
          >
            {(() => {
              const grouped = {};
              msg.reactions.forEach((r) => {
                if (!r?.emoji) return;
                if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, users: [] };
                grouped[r.emoji].count++;
                grouped[r.emoji].users.push(r.user_id);
              });
              return Object.entries(grouped).map(([emoji, { count, users }]) => (
                <span key={emoji} title={users.map((u) => getName(u)).filter(Boolean).join(", ")} className="flex items-center gap-0.5 text-sm">
                  {count > 1 && <span className="text-[10px] font-semibold">{count}</span>}
                  <span>{emoji}</span>
                </span>
              ));
            })()}
          </div>
        )}
      </div>

      <ReactionViewerDrawer
        open={showReactions}
        reactions={msg.reactions}
        friendMap={friendMap}
        userInfoMap={userInfoMap}
        onClose={() => setShowReactions(false)}
        onRemoveReaction={() => {
          updateGroupMessageReaction(msg.uid, msg.id, me, null, "reactionRemoved");
          removeGroupMessageReaction({ groupId: msg.uid, messageId: msg.id }).catch(console.error);
          setShowReactions(false);
        }}
      />

      {showMenu && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999]" onClick={() => { setShowMenu(false); setShowEmojiPicker(false); }}>
          {showEmojiPicker ? (
            <div
              className="fixed bg-base-100 shadow-xl border border-base-300 rounded-2xl overflow-hidden w-72 max-h-80"
              style={{ left: Math.min(menuPos.x, window.innerWidth - 288), top: Math.max(menuPos.y - 320, 8) }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 p-3 border-b border-base-200">
                <button
                  className="btn btn-ghost btn-xs p-1"
                  onClick={() => setShowEmojiPicker(false)}
                >
                  ←
                </button>
                <span className="font-semibold text-sm">Chọn emoji</span>
              </div>
              <div className="grid grid-cols-8 gap-1 p-3 overflow-y-auto max-h-64">
                {EMOJI_GRID.map((emoji) => (
                  <button
                    key={emoji}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xl ${
                      myReaction === emoji
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => sendReaction(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="fixed flex flex-col gap-2"
              style={{
                left: Math.min(menuPos.x - (window.innerWidth < 640 ? 40 : 0), window.innerWidth - 200),
                top: Math.max(menuPos.y - 16, 8),
                transform: "translateY(-100%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-1 bg-base-100 shadow-lg border border-base-300 rounded-full p-1.5 self-start">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-xl active:scale-110 transition-transform ${
                      myReaction === emoji
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "hover:bg-base-200"
                    }`}
                    onClick={() => sendReaction(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="bg-base-100 shadow-lg text-base-content border border-base-300 rounded-2xl overflow-hidden min-w-[180px]">
                <button
                  className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 w-full text-left text-sm font-medium"
                  onClick={() => setShowEmojiPicker(true)}
                >
                  <span className="text-lg">😊</span>
                  <span>Reaction</span>
                </button>
                {content.type !== "moment" && (
                  <button
                    className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 w-full text-left text-sm font-medium"
                    onClick={() => {
                      navigator.clipboard.writeText(content.content || "");
                      SonnerInfo("Đã sao chép");
                      setShowMenu(false);
                    }}
                  >
                    <span className="text-lg">📋</span>
                    <span>Sao chép</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}

      <div className="chat-footer opacity-50 text-[9px] mt-0.5">
        {formatTime(msg.created_at || msg.create_time * 1000)}
      </div>
    </div>
  );
};

export default GroupMessageItem;
