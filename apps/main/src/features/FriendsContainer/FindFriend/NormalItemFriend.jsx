import React from "react";
import FriendActionButton from "../components/FriendActionButton";

export default function NormalItemFriend({
  friend,
  handleAddFriend,
  loading,
  disabled,
  status
}) {
  return (
    <div
      key={friend.uid}
      className="flex w-full items-center gap-3 space-y-2 rounded-md cursor-pointer justify-between"
    >
      <div className="flex items-center gap-3">
        <img
          src={friend.profile_picture_url || "./default-avatar.png"}
          alt={`${friend?.first_name} ${friend?.last_name}`}
          className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
        />
        <div>
          <h2 className="font-medium">
            {friend?.first_name} {friend?.last_name}
          </h2>
          <p className="text-sm text-gray-500 underline">
            @{friend.username || "Không có username"}
          </p>
        </div>
      </div>

      <FriendActionButton
        status={status}
        onAdd={handleAddFriend}
        loading={loading}
        onAccept={() => console.log("accept")}
        onReject={() => console.log("reject")}
        disabled={disabled}
      />
    </div>
  );
}
