import { useAuthStore, useFriendStoreV3, useGroupChatStore } from "@/stores";
import { formatTimeAgo } from "@/utils";
import React, { useMemo } from "react";

const UserInfo = ({ user: userId, date, groupId }) => {
  const me = useAuthStore((s) => s.user);
  const friendMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const groups = useGroupChatStore((s) => s.groups);

  const groupMap = useMemo(() => {
    return new Map(groups.map((g) => [g.id, g]));
  }, [groups]);

  const group = groupId ? groupMap.get(groupId) : null;

  const displayUser =
    !userId || userId === me?.uid
      ? me
      : (friendMap?.[userId] ?? { uid: userId });

  const isMe = !userId || userId === me?.uid;

  const fullName = `${displayUser?.firstName ?? ""} ${
    displayUser?.lastName ?? ""
  }`.trim();

  // =========================
  // GROUP UI
  // =========================
  if (groupId && group) {
    return (
      <div className="flex items-start gap-3 text-base-content">
        {/* AVATAR STACK */}
        <div className="flex flex-row relative">
          {/* GROUP AVATAR */}
          <img
            src={group.image_url || "/images/default_group.png"}
            className="w-10 h-10 rounded-full object-cover border border-base-300"
          />

          {/* USER OVERLAY AVATAR */}
          <img
            src={
              displayUser?.profilePicture ||
              displayUser?.profilePic ||
              "/images/default_profile.png"
            }
            className="w-10 h-10 rounded-full object-cover border-2 border-base-100 -ml-3"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col min-w-0">
          {/* GROUP NAME */}
          <span className="font-semibold text-sm truncate">{group.name}</span>

          {/* USER NAME */}
          <span className="text-xs text-base-content/70 truncate">
            {isMe ? "Bạn" : (displayUser?.firstName ?? "Người dùng")}{" ~ "}
            <span className="text-xs text-base-content/50">
              {formatTimeAgo(date)}
            </span>
          </span>

          {/* TIME + BADGE */}
          <div className="flex items-center gap-2 mt-1">
            {displayUser?.badge === "locket_gold" && (
              <img
                src="https://cdn.locket-dio.com/v1/caption/caption-icon/locket_gold_badge.png"
                className="w-4 h-4"
              />
            )}

            {displayUser?.isCelebrity && (
              <img
                src="https://cdn.locket-dio.com/v1/caption/caption-icon/celebrity_badge.png"
                className="w-4 h-4"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // NORMAL USER UI
  // =========================
  return (
    <div className="flex items-center gap-2 text-base-content">
      <img
        src={
          displayUser?.profilePicture ||
          displayUser?.profilePic ||
          "/images/default_profile.png"
        }
        alt={fullName}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold truncate">
          {isMe ? "Bạn" : (displayUser?.firstName ?? "Người dùng")}
        </span>

        <span className="text-xs text-base-content/50">
          {formatTimeAgo(date)}
        </span>
      </div>

      {/* BADGE */}
      {displayUser?.badge === "locket_gold" && (
        <img
          src="https://cdn.locket-dio.com/v1/caption/caption-icon/locket_gold_badge.png"
          className="w-4 h-4"
        />
      )}

      {displayUser?.isCelebrity && (
        <img
          src="https://cdn.locket-dio.com/v1/caption/caption-icon/celebrity_badge.png"
          className="w-4 h-4"
        />
      )}
    </div>
  );
};

export default UserInfo;
