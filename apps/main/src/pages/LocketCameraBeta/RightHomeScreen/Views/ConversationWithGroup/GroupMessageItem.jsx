import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFriendStoreV3, useUserInfoStore, useMessagesStore } from "@/stores";
import { reactToGroupMessage, removeGroupMessageReaction } from "@/services";

import { ReactionViewerDrawer } from "./components/ReactionViewerDrawer";
import { MomentContent } from "./components/MomentContent";
import { SystemMessage } from "./components/SystemMessage";
import { MessageContextMenu } from "./components/MessageContextMenu";

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
    return (
      <SystemMessage 
        content={content} 
        actorUid={actorUid} 
        targetUid={targetUid} 
        getName={getName} 
      />
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

      <MessageContextMenu
        showMenu={showMenu}
        showEmojiPicker={showEmojiPicker}
        menuPos={menuPos}
        myReaction={myReaction}
        content={content}
        onClose={() => {
          setShowMenu(false);
          setShowEmojiPicker(false);
        }}
        onShowEmojiPicker={setShowEmojiPicker}
        onSendReaction={sendReaction}
      />

      <div className="chat-footer opacity-50 text-[9px] mt-0.5">
        {formatTime(msg.created_at || msg.create_time * 1000)}
      </div>
    </div>
  );
};

export default GroupMessageItem;
