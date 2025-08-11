// components/FriendItem.jsx
import React from "react";
import { X } from "lucide-react";

export default function FriendItem({ friend, onDelete }) {
  return (
    <div
      key={friend.uid}
      className="flex items-center gap-3 space-y-2 rounded-md cursor-pointer justify-between"
    >
      <div className="flex items-center gap-3">
        <img
          src={friend.profilePic || "./default-avatar.png"}
          alt={`${friend.firstName} ${friend.lastName}`}
          className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400 object-cover"
        />
        <div>
          <h2 className="font-medium">
            {friend.firstName} {friend.lastName}
          </h2>
          <p className="text-sm text-gray-500 underline">
            @{friend.username || "Không có username"}
          </p>
        </div>
      </div>
      <button
        className="text-red-500 flex flex-row justify-center p-1 px-2.5 rounded-full transition shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(friend.uid);
        }}
      >
        <X className="w-6 h-6" />
        {/* <span className="text-base font-semibold">Huỷ bạn bè</span> */}
      </button>
    </div>
  );
}
