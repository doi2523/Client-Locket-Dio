import { useApp } from "@/context/AppContext";
import { useAuthStore } from "@/stores";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";

function HistorySelectFriend({
  friendList,
  isVisible,
  setIsVisible,
  setFriendName,
  onClick,
}) {
  const { navigation, post } = useApp();
  const { isBottomOpen, isFriendHistoryOpen, setFriendHistoryOpen } =
    navigation;
  const { setSelectedFriendUid, setSelectedMoment, setSelectedQueue } = post;

  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friendList.filter((friend) => {
    const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    const username = (friend.username || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || username.includes(term);
  });

  const handleSelectFriend = (friend) => {
    const fullName = `${friend.firstName || ""} ${
      friend.lastName || ""
    }`.trim();

    setSelectedFriendUid(friend.uid);

    setFriendName(truncateName(fullName, 15));

    setFriendHistoryOpen(false);
    setSelectedMoment(null);
    setSelectedQueue(null);
    setTimeout(() => setIsVisible(false), 500);
  };

  const handleSelectAll = () => {
    setSelectedFriendUid(null);

    setFriendName("Mọi người");

    setFriendHistoryOpen(false);
    setSelectedMoment(null);
    setSelectedQueue(null);
    setTimeout(() => setIsVisible(false), 500);
  };

  const handleSelectMe = () => {
    setSelectedFriendUid(user?.uid);

    setFriendName("Bạn");

    setFriendHistoryOpen(false);
    setSelectedMoment(null);
    setSelectedQueue(null);
    setTimeout(() => setIsVisible(false), 500);
  };

  return (
    <>
      {isVisible && (
        <div
          onClick={onClick}
          className={`fixed inset-0 z-60 flex justify-center items-start backdrop-blur-[3px] px-4 bg-base-100/70
            transition-opacity duration-500 ease-in-out
            ${
              isFriendHistoryOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`overflow-hidden w-full max-w-xs sm:max-w-sm max-h-[500px] mt-14 transition-all duration-500 ease-in-out transform origin-top
                      ${
                        isFriendHistoryOpen
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-0"
                      }
                      bg-base-100 border border-base-300 rounded-3xl shadow-md py-3`}
          >
            <h3 className="font-semibold mb-3 text-base px-4">
              Danh sách bạn bè
            </h3>
            <div className="relative w-full py-2 px-4">
              <input
                type="text"
                className="w-full pr-10 border rounded-lg input input-ghost border-base-content transition-shadow font-semibold"
                placeholder="Tìm kiếm bạn bè..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute z-1 right-7 top-1/2 -translate-y-1/2 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div className="space-y-1.5 max-h-90 overflow-y-auto pt-3 px-4">
              {filteredFriends && filteredFriends.length > 0 ? (
                <>
                  {/* Mọi người */}
                  <div
                    onClick={() => handleSelectAll()}
                    className="flex items-center bg-base-200 p-2 justify-between hover:bg-base-200 rounded-2xl transition cursor-pointer active:scale-97 select-none"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                        <FaUserFriends className="w-6 h-6" />
                      </div>
                      <span className="text-base font-medium">Mọi người</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-base-content" />
                  </div>

                  {/* Danh sách bạn bè */}
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.uid}
                      onClick={() => handleSelectFriend(friend)}
                      className="flex bg-base-200 p-2 items-center justify-between hover:bg-base-200 rounded-2xl transition cursor-pointer active:scale-97 select-none"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            friend.profilePic || "/images/default_profile.png"
                          }
                          alt={friend.name || "avatar"}
                          className="w-10 h-10 rounded-full border-[2.5px] p-0.5 border-amber-400 object-cover"
                          onError={(e) => {
                            e.target.onerror = null; // tránh loop
                            e.target.src = "/images/default_profile.png";
                          }}
                        />
                        <span className="text-base font-medium">
                          {friend.firstName} {friend.lastName}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-base-content" />
                    </div>
                  ))}

                  {/* Bạn */}
                  <div
                    onClick={() => handleSelectMe()}
                    className="flex bg-base-200 p-2 items-center justify-between hover:bg-base-200 rounded-2xl transition cursor-pointer active:scale-97 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.profilePicture}
                        alt="Bạn"
                        className="w-10 h-10 rounded-full border-[2.5px] p-0.5 border-base-300 object-cover"
                      />
                      <span className="text-base font-medium">Bạn</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-base-content" />
                  </div>
                </>
              ) : (
                <div className="text-gray-400 italic text-sm text-center mt-6">
                  Không có bạn bè
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default HistorySelectFriend;

const truncateName = (name, length = 10) => {
  return name.length > length ? name.slice(0, length) + "..." : name;
};
