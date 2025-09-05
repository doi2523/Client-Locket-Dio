import { AuthContext } from "@/context/AuthLocket";
import { formatTimeAgo } from "@/utils";
import React, { useContext } from "react";

const UserInfo = ({ user, date }) => {
  const { user: me } = useContext(AuthContext);
  const getUserFromFriendDetails = (uid) => {
    if (!uid) return null;
    try {
      const data = localStorage.getItem("friendDetails");
      if (!data) return null;

      const users = JSON.parse(data);
      return users.find((f) => f.uid === uid) || null;
    } catch (error) {
      console.error("Lỗi khi đọc friendDetails từ localStorage:", error);
      return null;
    }
  };

  let displayUser = null;

  // Nếu không có user => chính mình
  if (!user || user.uid === me?.uid) {
    displayUser = {
      fullName: "Bạn",
      profilePic: me?.profilePicture || "./prvlocket.png",
    };
  } else {
    // Nếu có user => lấy thông tin từ friendDetails
    const friend = getUserFromFriendDetails(user.uid);
    if (friend) {
      displayUser = {
        fullName: `${friend.firstName} ${friend.lastName || ""}`.trim(),
        profilePic: friend.profilePic,
      };
    } else {
      // fallback nếu không tìm thấy
      displayUser = {
        fullName: "Người dùng",
        profilePic: "./prvlocket.png",
      };
    }
  }

  // Rút gọn tên nếu quá dài
  const shortName =
    displayUser.fullName.length > 10
      ? displayUser.fullName.slice(0, 10) + "…"
      : displayUser.fullName;

  return (
    <div className="flex items-center gap-2 text-md text-muted-foreground">
      <div className="flex items-center gap-1">
        <img
          src={displayUser.profilePic}
          alt={displayUser.fullName}
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
