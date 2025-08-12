import { useState } from "react";
import clsx from "clsx";

export default function FriendSelectItems({ friend, isSelected, onToggle }) {
  const [imgError, setImgError] = useState(false);

  // Lấy ký tự đầu của firstName + ký tự đầu của lastName
  const initials = (
    (friend?.firstName?.[0] || "") + (friend?.lastName?.[0] || "")
  ).toUpperCase();

  return (
    <div
      onClick={() => onToggle(friend.uid)}
      className={clsx(
        "flex flex-col items-center cursor-pointer transition-opacity hover:opacity-80 active:opacity-60 snap-center shrink-0",
        isSelected ? "opacity-100" : "opacity-60"
      )}
    >
      <div
        className={clsx(
          "flex p-0.5 flex-col items-center justify-center cursor-pointer rounded-full border-[2.5px] transition-all duration-300 transform",
          isSelected ? "border-amber-400 scale-100" : "border-gray-700 scale-95"
        )}
      >
        {imgError ? (
          <div className="w-11 h-11 rounded-full bg-base-300 flex items-center justify-center text-xl font-bold text-primary">
            {initials || "?"}
          </div>
        ) : (
          <img
            src={friend.profilePic || "./prvlocket.png"}
            alt={friend.firstName}
            onError={() => setImgError(true)}
            className="w-11 h-11 rounded-full object-cover"
          />
        )}
      </div>

      <span className="text-xs mt-1 text-center max-w-[4rem] font-semibold truncate text-base-content transition-opacity duration-300">
        {friend?.firstName} {friend?.lastName}
      </span>
    </div>
  );
}
