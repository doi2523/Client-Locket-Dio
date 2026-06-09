import { formatTimeAgoV2 } from "@/utils";
import { ChevronRight, Users } from "lucide-react";
import { useFriendStoreV3 } from "@/stores";

function getGroupDisplayName(group, memberDetails) {
  if (group?.name) return group.name;
  if (group?.emoji) return group.emoji;

  const names = memberDetails
    .map((f) => f?.firstName)
    .filter(Boolean)
    .slice(0, 3);

  if (names.length) return names.join(", ");
  return "Nhóm chat";
}

// ================= Component: ConversationItem =================
export const ConversationItem = ({ msg, onSelect }) => {
  const friendMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const isGroup = msg.type === "group";

  const friendDetail = !isGroup ? (friendMap?.[msg.with_user] ?? null) : null;
  const groupMembers = isGroup
    ? (msg.group?.users || [])
        .map((u) => friendMap?.[u.user_id])
        .filter(Boolean)
    : [];

  const displayName = isGroup
    ? getGroupDisplayName(msg.group, groupMembers)
    : `${friendDetail?.firstName || ""} ${friendDetail?.lastName || ""}`.trim();

  const latestSender = isGroup
    ? friendMap?.[msg.latestMessage?.userId]
    : null;

  const previewText = msg.latestMessage?.replyMoment
    ? "Đã trả lời Locket của bạn!"
    : isGroup && latestSender
      ? `${latestSender.firstName}: ${msg.latestMessage?.body || ""}`
      : msg.latestMessage?.body || "";

  const isUnread = msg.isRead === false;
  const sortTime = Number(msg.latestMessage?.createdAt || msg.update_time || 0);

  return (
    <div
      onClick={() =>
        onSelect({
          uid: msg.uid,
          type: msg.type || "direct",
          with_user: msg.with_user,
          group: msg.group || null,
          isRead: msg.isRead,
          friend: friendDetail || null,
        })
      }
      className={`relative w-full flex items-center gap-3 p-3 rounded-3xl shadow-sm cursor-pointer transition 
      ${isUnread ? "bg-base-200" : "bg-base-200"}`}
    >
      {/* Avatar */}
      {isGroup ? (
        msg.group?.image_url ? (
          <img
            src={msg.group.image_url}
            alt={displayName}
            className={`w-15 h-15 rounded-full p-0.5 object-cover transition-all duration-200 
              ${
                isUnread
                  ? "border-[3px] border-amber-400"
                  : "border-[3px] border-gray-300"
              }`}
          />
        ) : (
          <div
            className={`w-15 h-15 rounded-full flex items-center justify-center bg-primary/10 transition-all duration-200 
              ${
                isUnread
                  ? "border-[3px] border-amber-400"
                  : "border-[3px] border-gray-300"
              }`}
          >
            {msg.group?.emoji ? (
              <span className="text-2xl">{msg.group.emoji}</span>
            ) : groupMembers[0]?.profilePic ? (
              <img
                src={groupMembers[0].profilePic}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Users className="w-6 h-6 text-primary" />
            )}
          </div>
        )
      ) : friendDetail ? (
        <img
          src={friendDetail.profilePic || "/default-avatar.png"}
          alt={friendDetail?.firstName || "user"}
          className={`w-15 h-15 rounded-full p-0.5 object-cover transition-all duration-200 
            ${
              isUnread
                ? "border-[3px] border-amber-400"
                : "border-[3px] border-gray-300"
            }`}
        />
      ) : (
        <div className="w-15 h-15 rounded-full bg-gray-300 animate-pulse" />
      )}

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-lg truncate ${
            isUnread
              ? "font-bold text-base-content"
              : "font-semibold text-base-content/50"
          }`}
        >
          {displayName} ~ {formatTimeAgoV2(sortTime)}
        </p>
        <p
          className={`text-md truncate pt-1 font-semibold ${
            isUnread ? "text-base-content" : "text-base-content/50"
          }`}
        >
          {previewText}
        </p>
      </div>

      {/* Chevron */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <ChevronRight className="w-6 h-6 text-gray-500" />
      </div>
    </div>
  );
};
