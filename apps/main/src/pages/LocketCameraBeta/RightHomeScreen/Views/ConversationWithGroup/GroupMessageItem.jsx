import React from "react";
import { useFriendStoreV3 } from "@/stores";

// ================= Component: GroupMessageItem =================
const GroupMessageItem = ({ msg }) => {
  const me = localStorage.getItem("localId");
  const isMe = msg.user_id === me;

  const friendMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const senderDetail = friendMap?.[msg.user_id] ?? null;
  // Lấy tên hiển thị của sender
  const senderName = isMe
    ? "Bạn"
    : senderDetail
      ? `${senderDetail.firstName} ${senderDetail.lastName}`
      : "Thành viên nhóm";

  const avatarUrl = senderDetail?.profilePic || "/default-avatar.png";

  // Định dạng thời gian gửi tin nhắn (created_at là ms)
  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(Number(ts)).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`chat ${isMe ? "chat-end" : "chat-start"}`} key={msg.id}>
      {/* Avatar người gửi (nếu không phải là mình) */}
      {!isMe && (
        <div className="chat-image avatar">
          <div className="w-8 h-8 rounded-full border border-base-300">
            <img src={avatarUrl} alt={senderName} />
          </div>
        </div>
      )}

      {/* Tên người gửi (nếu không phải là mình) */}
      {!isMe && (
        <div className="chat-header text-[10px] font-semibold opacity-70 mb-1 ml-1">
          {senderName}
        </div>
      )}

      {/* Nội dung tin nhắn */}
      <div className="chat-bubble relative bg-base-200 text-base-content font-medium rounded-2xl max-w-xs md:max-w-md">
        {/* Reply Momemt/Message nếu có */}
        {msg.reply_moment && (
          <div className="text-xs italic opacity-75 mb-1 text-primary">
            ↪ Đã phản hồi khoảnh khắc
          </div>
        )}

        {/* Text */}
        <span className="break-words text-sm">
          {msg.content?.content || msg.text || ""}
        </span>

        {/* Reactions */}
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

      {/* Thời gian */}
      <div className="chat-footer opacity-50 text-[9px] mt-0.5">
        {formatTime(msg.created_at || (msg.create_time * 1000))}
      </div>
    </div>
  );
};

export default GroupMessageItem;
