import { useAuthStore, useFriendStoreV2 } from "@/stores";
import { formatTimeAgo } from "@/utils";

const UserInfo = ({ user: userId, date }) => {
  const me = useAuthStore((s) => s.user);
  const friendMap = useFriendStoreV2((s) => s.friendDetailsMap);

  // -------------------------
  // RESOLVE USER DATA
  // -------------------------
  const displayUser =
    !userId || userId === me?.uid
      ? me
      : friendMap?.[userId] ?? { uid: userId };

  const isMe = !userId || userId === me?.uid;

  const fullName = `${displayUser?.firstName ?? ""} ${
    displayUser?.lastName ?? ""
  }`.trim();

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="flex items-center gap-2 text-md text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <img
          src={
            displayUser?.profilePicture ||
            displayUser?.profilePic ||
            "/images/default_profile.png"
          }
          alt={fullName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="truncate max-w-[100px] text-base text-base-content font-semibold">
          {isMe ? "Bạn" : displayUser?.firstName ?? "Người dùng"}
        </span>
      </div>

      {/* BADGE */}
      {displayUser?.badge === "locket_gold" && (
        <img
          src="https://cdn.locket-dio.com/v1/caption/caption-icon/locket_gold_badge.png"
          alt="Gold Badge"
          className="w-5 h-5"
        />
      )}

      {displayUser?.isCelebrity && (
        <img
          src="https://cdn.locket-dio.com/v1/caption/caption-icon/celebrity_badge.png"
          alt="Celebrity"
          className="w-5 h-5"
        />
      )}

      <div className="text-base-content font-semibold">
        {formatTimeAgo(date)}
      </div>
    </div>
  );
};

export default UserInfo;
