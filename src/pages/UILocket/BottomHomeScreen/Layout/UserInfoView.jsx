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
    fullName.length > 10 ? fullName.slice(0, 10) + "…" : fullName;

  return (
    <div className="flex items-center gap-2 text-md text-muted-foreground">
      <div className="flex items-center gap-1">
        <img
          src={user.profilePic}
          alt={fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="truncate max-w-[80px] text-base text-base-content font-semibold">
          {shortName}
        </span>
      </div>
      <div className="text-base-content font-semibold">
        {formatTimeAgo(date)}
      </div>
    </div>
  );
};

export default UserInfo;
