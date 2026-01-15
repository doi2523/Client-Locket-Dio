import React from "react";
import { Link, Plus, UserRoundCheck } from "lucide-react";
import { SonnerSuccess } from "@/components/ui/SonnerToast";

export default function CelebrateItem({ user, slotdata, onAdd }) {
  // Tính % bạn bè (nếu có dữ liệu)
  const percent =
    slotdata?.max_friends && slotdata?.friend_count
      ? Math.min((slotdata.friend_count / slotdata.max_friends) * 100, 100)
      : 0;

  const isFullSlot =
    slotdata?.max_friends && slotdata?.friend_count >= slotdata?.max_friends;

  const handleCopyUsername = () => {
    if (!user?.username) return;
    const url = `https://locket.cam/${user.username}`;
    navigator.clipboard.writeText(url);
    SonnerSuccess("Đã sao chép URL profile!", ` ${url}`);
  };

  // const handleCopyLink = () => {
  // if (!user?.uid) return;
  // const url = `https://locket.camera/links/${user.uid}`;
  // navigator.clipboard.writeText(url);
  // SonnerSuccess("Đã sao chép URL chia sẻ!", ` ${url}`);
  // };

  return (
    <div
      key={user.uid}
      className="flex flex-col gap-2 p-3 rounded-3xl shadow-md bg-base-100 m-2"
    >
      {/* Hàng trên: avatar + info + action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar + badge overlay */}
          <div className="relative w-12 h-12">
            <img
              src={user.profile_picture_url || "./default-avatar.png"}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-12 h-12 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
            />

            {/* Ưu tiên hiển thị badge nếu có, nếu không thì celeb */}
            {user.badge === "locket_gold" ? (
              <img
                src="https://cdn.locket-dio.com/v1/caption/caption-icon/locket_gold_badge.png"
                alt="Gold Badge"
                className="absolute bottom-0 right-0 w-4 h-4 p-0.5 bg-base-100 rounded-full"
              />
            ) : user.celebrity ? (
              <img
                src="https://cdn.locket-dio.com/v1/caption/caption-icon/celebrity_badge.png"
                alt="Celebrity"
                className="absolute bottom-0 right-0 w-4 h-4 p-0.5 bg-base-100 rounded-full"
              />
            ) : null}
          </div>

          {/* Thông tin bạn bè */}
          <div>
            <h2 className="font-medium">
              {user.first_name} {user.last_name}
            </h2>
            <p
              className="text-sm text-blue-500 underline cursor-pointer hover:text-blue-600"
              onClick={handleCopyUsername}
            >
              @{user.username || "Không có username"}
            </p>
            {/* <p
              className="flex flex-row items-center text-sm text-blue-500 underline cursor-pointer hover:text-blue-600 mt-1"
              onClick={handleCopyLink}
            >
              <Link className="w-4 h-4 mr-1" /> Link chia sẻ
            </p> */}
          </div>
        </div>

        {/* Bên phải: render theo friendship_status */}
        {user.friendship_status === "friends" ? (
          <div className="flex flex-row items-center gap-1 text-white bg-primary px-2 py-1 rounded-2xl">
            <UserRoundCheck className="w-5 h-5" />
            <span className="text-sm font-semibold">Bạn bè</span>
          </div>
        ) : user.friendship_status === "follower-waitlist" ? (
          <>
            <button
              disabled={isFullSlot}
              className={`flex items-center gap-1 px-2 py-1 rounded-2xl font-semibold
                ${
                  isFullSlot
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-cyan-300 text-blue-500 hover:text-blue-600"
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (isFullSlot) return;
                onAdd(user.uid);
              }}
            >
              {isFullSlot ? "Gửi lại yêu cầu" : "Đang xếp hàng"}
            </button>
          </>
        ) : user.friendship_status === "outgoing-follow-request" ? (
          <div className="text-white text-sm bg-primary px-2 py-1 rounded-2xl font-semibold">
            Đang chờ chấp nhận
          </div>
        ) : (
          <button
            disabled={isFullSlot}
            className={`flex items-center gap-1 px-2 py-1 rounded-2xl font-semibold
              ${
                isFullSlot
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-cyan-300 text-blue-500 hover:text-blue-600"
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              if (isFullSlot) return;
              onAdd(user.uid);
            }}
          >
            <Plus className="w-5 h-5" /> Thêm
          </button>
        )}
      </div>

      {/* Thanh tiến trình bạn bè */}
      {slotdata?.max_friends && (
        <div className="mt-1">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full ${
                percent >= 100 ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {slotdata.friend_count}/{slotdata.max_friends}
          </p>
        </div>
      )}
    </div>
  );
}
