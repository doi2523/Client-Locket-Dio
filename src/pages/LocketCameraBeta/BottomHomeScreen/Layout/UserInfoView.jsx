import { getFriendDetail } from "@/cache/friendsDB";
import { formatTimeAgo } from "@/utils";
import React, { useEffect, useState } from "react";

const UserInfo = ({ user, me, date }) => {
  const [displayUser, setDisplayUser] = useState(user);

  useEffect(() => {
    if (!user || user === me.uid) return; // chính mình → bỏ qua DB

    let mounted = true;
    getFriendDetail(user).then((detail) => {
      if (detail && mounted) setDisplayUser(detail);
    });

    return () => {
      mounted = false;
    };
  }, [user, me.uid]);

  // Nếu là chính mình
  if (!user || user === me.uid) {
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

  const fullName = `${displayUser?.firstName ?? ""} ${
    displayUser?.lastName ?? ""
  }`.trim();

  return (
    <div className="flex items-center gap-2 text-md text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <img
          src={displayUser?.profilePic}
          alt={fullName}
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="w-full text-base text-base-content font-semibold">
          {displayUser?.firstName}
        </span>
      </div>
      {displayUser?.badge === "locket_gold" ? (
        <img
          src="https://cdn.locket-dio.com/v1/caption/caption-icon/locket_gold_badge.png"
          alt="Gold Badge"
          className="w-5 h-5"
        />
      ) : displayUser?.isCelebrity ? (
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
