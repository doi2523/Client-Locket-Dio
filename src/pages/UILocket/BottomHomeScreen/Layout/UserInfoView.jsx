import { formatTimeAgo } from "@/utils";
import React from "react";

const UserInfo = ({ user, me, date }) => {
  // Nếu không có user (nghĩa là chính mình)
  if (!user) {
    return (
      <div className="flex items-center gap-2 text-md text-muted-foreground">
        <div className="flex items-center gap-2">
          <img
            src={me?.profilePicture || "./prvlocket.png"}
            alt={me?.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="truncate max-w-[80px] text-base text-base-content font-semibold">
            Bạn
          </span>
        </div>
        <div className="text-base-content font-semibold">
          {formatTimeAgo(date)}
        </div>
      </div>
    );
  }

  // Nếu có user
  const fullName = `${user.firstName} ${user.lastName || ""}`.trim();
  const shortName =
    fullName.length > 15 ? fullName.slice(0, 15) + "…" : fullName;

  return (
    <div className="flex items-center gap-2 text-md text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <img
          src={user.profilePic}
          alt={fullName}
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="truncate max-w-[80px] text-base text-base-content font-semibold">
          {user.firstName}
        </span>
      </div>
      {user.badge === "locket_gold" ? (
        <img
          src="https://cdn.locket-dio.com/v1/caption/caption-icon/locket_gold_badge.png"
          alt="Gold Badge"
          className="w-5 h-5"
        />
      ) : user.isCelebrity ? (
        <img
          src="https://cdn.locket-dio.com/v1/caption/caption-icon/celebrity_badge.png"
          alt="Celebrity"
          className="w-5 h-5"
        />
      ) : null}
      <div className="text-base-content font-semibold">
        {formatTimeAgo(date)}
      </div>
    </div>
  );
};

export default UserInfo;
