import React, { useEffect } from "react";
import { useFriendStoreV3, useUserInfoStore } from "@/stores";
import { OverlayRendererV2 } from "@/components/OverlayRender";

const MomentContent = ({ moment }) => {
  if (!moment?.thumbnail_url) return null;
  return (
    <div className="mt-2">
      <div className="relative rounded-4xl overflow-hidden border border-base-300">
        <img
          src={moment.thumbnail_url}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />

        {/* OVERLAY LAYER */}
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

  const friendMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const userInfoMap = useUserInfoStore((s) => s.userInfoMap);
  const ensureUserInfo = useUserInfoStore((s) => s.ensureUserInfo);

  const senderDetail =
    friendMap?.[msg.user_id] ?? userInfoMap?.[msg.user_id] ?? null;
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
    if (
      actorUid &&
      actorUid !== me &&
      !friendMap?.[actorUid] &&
      !userInfoMap?.[actorUid]
    )
      unknowns.push(actorUid);
    if (
      targetUid &&
      targetUid !== me &&
      !friendMap?.[targetUid] &&
      !userInfoMap?.[targetUid]
    )
      unknowns.push(targetUid);
    if (!isMe && !senderDetail) unknowns.push(msg.user_id);
    if (unknowns.length > 0) {
      unknowns.forEach((uid) => ensureUserInfo(uid));
    }
  }, [msg.id, actorUid, targetUid]);

  const getName = (uid) => {
    if (!uid) return null;
    if (uid === me) return "Bạn";
    const detail = friendMap?.[uid] ?? userInfoMap?.[uid] ?? null;
    if (detail?.firstName)
      return `${detail.firstName} ${detail.lastName}`.trim();
    return null;
  };

  if (isSystemMessage) {
    const actorName = getName(actorUid);
    const targetName = getName(targetUid);

    let sysText = "";
    if (content.type === "userAddedToGroup") {
      sysText = actorName
        ? targetName
          ? `${actorName} đã thêm ${targetName} vào nhóm`
          : `${actorName} đã thêm thành viên vào nhóm`
        : targetName
          ? `Đã thêm ${targetName} vào nhóm`
          : "Đã thêm thành viên vào nhóm";
    } else if (content.type === "userRemovedFromGroup") {
      sysText = actorName
        ? targetName
          ? `${actorName} đã xoá ${targetName} khỏi nhóm`
          : `${actorName} đã xoá thành viên khỏi nhóm`
        : targetName
          ? `Đã xoá ${targetName} khỏi nhóm`
          : "Đã xoá thành viên khỏi nhóm";
    } else if (content.type === "groupNameChanged") {
      sysText = actorName
        ? `${actorName} đã đổi tên nhóm thành "${content.name || ""}"`
        : `Đã đổi tên nhóm thành "${content.name || ""}"`;
    } else if (content.type === "groupImageChanged") {
      sysText = actorName
        ? `${actorName} đã thay đổi ảnh đại diện nhóm`
        : "Đã thay đổi ảnh đại diện nhóm";
    }
    return (
      <div className="text-center text-[11px] text-base-content/50 font-semibold py-2">
        {sysText}
      </div>
    );
  }

  const renderBody = () => {
    if (content.type === "moment") {
      return <MomentContent moment={content.moment} />;
    }
    if (content.type === "text" || !content.type) {
      return (
        <>
          {content.content && (
            <span className="break-words text-sm">{content.content}</span>
          )}
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

      <div className="chat-bubble relative bg-base-200 text-base-content font-medium rounded-2xl max-w-xs md:max-w-md">
        {msg.reply_moment && (
          <div className="text-xs italic opacity-75 mb-1 text-primary">
            ↪ Đã phản hồi khoảnh khắc
          </div>
        )}

        {renderBody()}

        {msg.reactions && msg.reactions.length > 0 && (
          <div className="absolute -bottom-2 -right-1 flex gap-0.5 bg-base-300 px-1 py-0.5 rounded-full shadow text-[15px] cursor-pointer">
            {msg.reactions.map((r, idx) => (
              <span key={idx} title={getName(r.user_id)} className="text-sm">
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="chat-footer opacity-50 text-[9px] mt-0.5">
        {formatTime(msg.created_at || msg.create_time * 1000)}
      </div>
    </div>
  );
};

export default GroupMessageItem;
