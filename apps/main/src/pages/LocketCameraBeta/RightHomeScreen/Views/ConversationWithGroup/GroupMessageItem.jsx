import React from "react";
import { useFriendStoreV3 } from "@/stores";
import { getCaptionStyle } from "@/helpers/styleHelpers";

const MomentContent = ({ moment }) => {
  if (!moment?.thumbnail_url) return null;
  const overlay = (moment.overlays || []).find(
    (o) => o.overlay_type === "caption"
  );
  const captionText = overlay?.data?.text || moment.caption || "";
  const textColor = overlay?.data?.text_color || "#FFFFFFE6";
  const background = overlay?.data?.background;
  const captionIcon = overlay?.data?.icon;

  return (
    <div className="mt-2">
      <div className="relative rounded-xl overflow-hidden border border-base-300">
        <img
          src={moment.thumbnail_url}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {captionText && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 w-fit max-w-[90%] px-4 py-1 text-center font-semibold rounded-full"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              ...getCaptionStyle(background, textColor),
            }}
          >
            {captionIcon && captionIcon.type === "emoji" && (
              <span className="mr-1">{captionIcon.data}</span>
            )}
            {captionIcon && captionIcon.type === "url" && (
              <img src={captionIcon.data} alt="icon caption" className="mr-1" />
            )}
            {captionText}
          </div>
        )}
      </div>
    </div>
  );
};

const GroupMessageItem = ({ msg }) => {
  const me = localStorage.getItem("localId");
  const isMe = msg.user_id === me;

  const friendMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const senderDetail = friendMap?.[msg.user_id] ?? null;
  const senderName = isMe
    ? "Bạn"
    : senderDetail
      ? `${senderDetail.firstName} ${senderDetail.lastName}`
      : "Thành viên nhóm";

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

  if (isSystemMessage) {
    let sysText = "";
    if (content.type === "userAddedToGroup") sysText = "👤 Đã thêm thành viên vào nhóm";
    else if (content.type === "userRemovedFromGroup") sysText = "👤 Đã xóa thành viên khỏi nhóm";
    else if (content.type === "groupNameChanged") sysText = `✏️ Đã đổi tên nhóm thành "${content.name || ""}"`;
    else if (content.type === "groupImageChanged") sysText = "🖼️ Đã thay đổi ảnh đại diện nhóm";
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
          <div className="absolute -bottom-2 -right-1 flex gap-0.5 bg-base-300 px-1 py-0.5 rounded-full shadow text-[10px]">
            {msg.reactions.map((r, idx) => (
              <span key={idx} title={r.user_id}>
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="chat-footer opacity-50 text-[9px] mt-0.5">
        {formatTime(msg.created_at || (msg.create_time * 1000))}
      </div>
    </div>
  );
};

export default GroupMessageItem;
