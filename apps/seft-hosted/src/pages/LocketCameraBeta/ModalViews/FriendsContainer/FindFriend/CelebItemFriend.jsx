import React from "react";
import { Plus, UserRoundCheck } from "lucide-react";

export default function CelebItemFriend({ friend, handleAddFriend }) {
  const friendCount = friend?.celebrity_data?.friend_count || 0;
  const maxFriends = friend?.celebrity_data?.max_friends || 0;

  const isSlotFull = friendCount >= maxFriends;

  const progressPercent =
    maxFriends > 0 ? Math.min((friendCount / maxFriends) * 100, 100) : 0;

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <img
              src={friend.profile_picture_url || "/images/default_profile.png"}
              alt={`${friend?.first_name} ${friend?.last_name}`}
              className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
              onError={(e) => {
                e.target.onerror = null; // tránh loop
                e.target.src = "/images/default_profile.png";
              }}
            />
            <img
              src="https://cdn.locket-dio.com/v1/caption/caption-icon/celebrity_badge.png"
              alt="Celebrity"
              className="absolute bottom-0 right-0 w-6 h-6 p-0.5 bg-base-100 rounded-full"
            />
          </div>
          <div>
            <h2 className="font-semibold">
              {friend?.first_name} {friend?.last_name}
            </h2>

            <p className="text-sm text-base-content/60">
              @{friend.username || "Không có username"}
            </p>
          </div>
        </div>
        {/* Button */}
        <FriendActionButton
          friend={friend}
          isFullSlot={isSlotFull}
          onAdd={handleAddFriend}
        />
      </div>

      {/* Progress */}
      {isSlotFull && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-base-content/60">
            <span>
              {friendCount.toLocaleString()} / {maxFriends.toLocaleString()} bạn
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FriendActionButton({ friend, isFullSlot = false, onAdd }) {
  const status = friend?.friendship_status;

  const baseClass =
    "flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition-all";

  // Đã là bạn bè
  if (status === "friends") {
    return (
      <div className={`${baseClass} bg-primary text-primary-content`}>
        <UserRoundCheck className="w-5 h-5" />
        Bạn bè
      </div>
    );
  }

  // follower-waitlist
  if (status === "follower-waitlist") {
    return (
      <button
        disabled={isFullSlot}
        onClick={(e) => {
          e.stopPropagation();
          if (isFullSlot) return;
          onAdd?.(friend.uid);
        }}
        className={`${baseClass} ${
          isFullSlot
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-yellow-500 text-black hover:bg-yellow-400"
        }`}
      >
        {isFullSlot ? "Đang xếp hàng" : "Gửi lại yêu cầu"}
      </button>
    );
  }

  // outgoing-follow-request
  if (status === "outgoing-follow-request") {
    return (
      <div className={`${baseClass} bg-base-200 text-base-content`}>
        Đang chờ chấp nhận
      </div>
    );
  }

  // default
  return (
    <button
      disabled={isFullSlot}
      onClick={(e) => {
        e.stopPropagation();
        if (isFullSlot) return;
        onAdd?.(friend.uid);
      }}
      className={`${baseClass} ${
        isFullSlot
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-yellow-500 text-black hover:bg-yellow-400"
      }`}
    >
      <Plus className="w-5 h-5" />
      Theo dõi
    </button>
  );
}
