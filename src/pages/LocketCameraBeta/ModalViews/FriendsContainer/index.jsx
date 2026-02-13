import { useRef, useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { X } from "lucide-react";
import { AcceptRequestToFriend } from "@/services";
import IncomingFriendRequests from "./IncomingRequests";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import OutgoingRequest from "./OutgoingRequest";
import { useFriendStoreV2 } from "@/stores";
import FindFriend from "./FindFriend";
import FriendList from "./FriendList";

const FriendsContainer = () => {
  const popupRef = useRef(null);
  const { navigation } = useApp();

  const {
    friendList,
    loading,
    loadFriends,
    removeFriendLocal,
    addFriendLocal,
    hiddenUserState,
    friendRelationsMap,
  } = useFriendStoreV2();

  const { isFriendsTabOpen, setFriendsTabOpen, isPWA } = navigation;
  const [showAllFriends, setShowAllFriends] = useState(false);

  //Khoá cuộn màn hình cho thẻ body
  useEffect(() => {
    if (isFriendsTabOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      setShowAllFriends(false);
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
      setShowAllFriends(false);
    };
  }, [isFriendsTabOpen]);

  const handleAcceptRequest = async (uid) => {
    try {
      const data = await AcceptRequestToFriend(uid);
      if (data) {
        addFriendLocal(data);
        // ✅ Hiển thị thông báo
        SonnerSuccess(
          "Thông báo từ Locket Dio",
          `Đã chấp nhận ${data.firstName}`,
        );
      } else {
        SonnerError(
          "Thông báo từ Locket Dio",
          "Không tìm thấy lời mời để chấp nhận.",
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi chấp nhận lời mời:", error.message || error);
      SonnerError("❌ Chấp nhận lời mời thất bại!");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-500 z-0 ${
          isFriendsTabOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        onClick={() => {
          setFriendsTabOpen(false);
          setShowAllFriends(false);
        }}
      />

      {/* Popup */}
      <div
        className={`fixed inset-0 z-50 flex justify-center items-end transition-all duration-800 ease text-base-content ${
          isFriendsTabOpen
            ? "translate-y-0"
            : "translate-y-full pointer-events-none"
        }`}
      >
        <div
          ref={popupRef}
          className={`relative w-full ${isPWA ? "h-[95vh]" : "h-[85vh]"}
            bg-base-100 flex flex-col rounded-t-4xl shadow-lg
            will-change-transform outline-2 outline-base-content outline-dashed z-50`}
        >
          {/* Header */}
          <div className="sticky top-0 shadow-md z-10 flex flex-col items-center pb-2 px-3 bg-base-100 rounded-t-4xl">
            <div className="flex justify-between items-center w-full">
              <div className="w-12 h-1.5 bg-base-content rounded-full mx-auto my-2" />
              <button
                className="absolute top-2 right-3"
                onClick={() => setFriendsTabOpen(false)}
              >
                <X className="w-8 h-8 btn btn-circle p-1" />
              </button>
            </div>
            <h1 className="text-2xl font-semibold text-base-content">
              ❤️‍🔥 {friendList.length} người bạn
            </h1>
            <h2 className="text-md font-semibold text-base-content">
              Tìm kiếm và thêm bạn thân
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
            {/* Tìm kiếm */}
            <FindFriend />

            {/* Danh sách bạn bè */}
            <FriendList
              friendList={friendList}
              loading={loading}
              loadFriends={loadFriends}
              removeFriendLocal={removeFriendLocal}
              hiddenUserState={hiddenUserState}
              friendRelationsMap={friendRelationsMap}
              showAllFriends={showAllFriends}
              setShowAllFriends={setShowAllFriends}
            />

            {/* Requests */}
            <IncomingFriendRequests handleAcpFriend={handleAcceptRequest} />
            <OutgoingRequest />
          </div>
        </div>
      </div>
    </>
  );
};

export default FriendsContainer;
