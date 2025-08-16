import { ChevronDown, ChevronRight, MessageCircle } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthLocket";
import { HiUsers } from "react-icons/hi2";
import { useApp } from "@/context/AppContext";
import Avatar from "../../ExtendPage/Badge/Avatar";

const HeaderHistory = () => {
  const { friendDetails, user } = useContext(AuthContext);
  const {
    selectedFriendUid,
    setSelectedFriendUid,
    setSelectedMoment,
    setSelectedQueue,
  } = useApp().post;
  const { setIsHomeOpen, setIsProfileOpen } = useApp().navigation;
  const [isOpen, setIsOpen] = useState(false); // Điều khiển animation
  const [isVisible, setIsVisible] = useState(false); // Điều khiển mount/unmount
  const [searchTerm, setSearchTerm] = useState("");
  const [friendName, setFriendName] = useState("Mọi người");

  const truncateName = (name, length = 10) => {
    return name.length > length ? name.slice(0, length) + "..." : name;
  };

  const toggleDropdown = () => {
    if (!isVisible) {
      setIsVisible(true);
      setTimeout(() => setIsOpen(true), 10); // delay nhỏ để đảm bảo DOM render xong
    } else {
      setIsOpen(false);
      setTimeout(() => setIsVisible(false), 500); // delay khớp duration của transition
    }
  };
  const filteredFriends = friendDetails.filter((friend) => {
    const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    const username = (friend.username || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || username.includes(term);
  });

  const handleSelectFriend = (uid, name) => {
    setSelectedFriendUid(uid);
    setFriendName(name || "Mọi người");
    setIsOpen(false);
    setSelectedMoment(null);
    setSelectedQueue(null);
    setTimeout(() => setIsVisible(false), 500);
  };

  return (
    <div className="px-4 py-2 text-base-content">
      <div className="flex flex-row justify-between w-full items-center">
        {/* Trái: Badge */}
        <div
          className="flex justify-start items-center"
          onClick={() => setIsProfileOpen(true)}
        >
          <Avatar />
        </div>

        {/* Giữa: Dropdown Toggle */}
        <div className="flex justify-center items-center relative">
          <div
            onClick={toggleDropdown}
            className="bg-base-300/20 whitespace-nowrap drop-shadow-2xl backdrop-blur-md px-4 py-2.5 rounded-3xl font-semibold text-md flex items-center cursor-pointer hover:bg-base-300 transition"
          >
            {truncateName(friendName)}
            <ChevronDown
              className={`ml-1 w-5 h-5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              strokeWidth={2.5}
            />
          </div>
        </div>

        {/* Phải: Tin nhắn */}
        <div className="flex justify-end items-center">
          <button
            onClick={() => setIsHomeOpen(true)}
            className="rounded-full p-2 backdrop-blur-2xl relative"
          >
            <MessageCircle size={30} />
          </button>
        </div>
      </div>

      {/* Overlay + Friend List */}
      {isVisible && (
        <div
          onClick={toggleDropdown}
          className={`fixed inset-0 z-50 flex justify-center items-start backdrop-blur-[2px] mt-14 px-4 bg-black/30
    transition-opacity duration-500 ease-in-out
    ${
      isOpen
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`overflow-hidden w-full max-w-md max-h-[500px] transition-all duration-500 ease-in-out transform origin-top
              ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}
              bg-base-100 border border-base-300 rounded-xl shadow-md px-4 py-3`}
          >
            <h3 className="font-semibold mb-3 text-base">Danh sách bạn bè</h3>
            <div className="relative w-full mt-2">
              <input
                type="text"
                className="w-full pr-10 border rounded-lg input input-ghost border-base-content transition-shadow font-semibold"
                placeholder="Tìm kiếm bạn bè..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute z-1 right-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
            <div className="space-y-3 max-h-90 overflow-y-auto pt-4">
              {filteredFriends && filteredFriends.length > 0 ? (
                <>
                  {/* Mọi người */}
                  <div
                    onClick={() => handleSelectFriend(null, "Mọi người")}
                    className="flex items-center justify-between hover:bg-base-200 px-3 py-2 rounded-lg transition cursor-pointer pt-2 mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <HiUsers className="w-11 h-11 rounded-full border-[2.5px] p-2 border-amber-400 object-cover" />
                      <span className="text-base font-medium">Mọi người</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-base-content" />
                  </div>

                  {/* Danh sách bạn bè */}
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.uid}
                      onClick={() =>
                        handleSelectFriend(
                          friend.uid,
                          `${friend.firstName || ""} ${
                            friend.lastName || ""
                          }`.trim()
                        )
                      }
                      className="flex items-center justify-between hover:bg-base-200 px-3 py-2 rounded-lg transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={friend.profilePic || "/default-avatar.png"}
                          alt={friend.name || "avatar"}
                          className="w-11 h-11 rounded-full border-[2.5px] p-0.5 border-amber-400 object-cover"
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
                    onClick={() => handleSelectFriend(user?.uid, "Bạn")}
                    className="flex items-center justify-between hover:bg-base-200 px-3 py-2 rounded-lg transition cursor-pointer pt-2 mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.profilePicture}
                        alt="Bạn"
                        className="w-11 h-11 rounded-full border-[2.5px] p-0.5 border-base-300 object-cover"
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
    </div>
  );
};

export default HeaderHistory;
