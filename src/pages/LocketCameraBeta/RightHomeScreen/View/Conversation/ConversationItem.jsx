import { useMemo } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import { formatTimeAgoV2 } from "@/utils";
import { ChevronRight } from "lucide-react";

// ================= Component: ConversationItem =================
export const ConversationItem = ({ msg, onSelect }) => {
  const friendDetails = useFriendStore((s) => s.friendDetails);

  // 🔹 Tìm bạn trong danh sách friendDetails
  const friendDetail = useMemo(
    () => friendDetails.find((f) => f.uid === msg.with_user),
    [friendDetails, msg.with_user]
  );

  const isUnread = msg.isRead === false;

  return (
    <div
      onClick={() =>
        onSelect({
          uid: msg.uid,
          with_user: msg.with_user,
          isRead: msg.isRead,
          friend: friendDetail || null,
        })
      }
      className={`relative w-full flex items-center gap-3 p-3 rounded-3xl shadow-sm cursor-pointer transition 
      ${isUnread ? "bg-base-200" : "bg-base-200"}`}
    >
      {/* Avatar */}
      {friendDetail ? (
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
              ? "font-bold text-black"
              : "font-semibold text-black opacity-60"
          }`}
        >
          {friendDetail?.firstName} {friendDetail?.lastName} ~{" "}
          {formatTimeAgoV2(Number(msg.latestMessage?.createdAt))}
        </p>
        <p
          className={`text-md truncate pt-1 font-semibold ${
            isUnread ? "text-black" : "text-gray-500 opacity-60"
          }`}
        >
          {msg.latestMessage?.replyMoment
            ? "Đã trả lời Locket của bạn!"
            : msg.latestMessage?.body || ""}
        </p>
      </div>

      {/* Chevron */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <ChevronRight className="w-6 h-6 text-gray-500" />
      </div>
    </div>
  );
};
