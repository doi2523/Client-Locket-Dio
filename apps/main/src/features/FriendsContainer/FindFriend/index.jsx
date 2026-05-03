import { useState } from "react";
import NormalItemFriend from "./NormalItemFriend";
import { FaSearchPlus } from "react-icons/fa";
import SearchInput from "@/components/ui/Input/SearchInput";
import CelebItemFriend from "./CelebItemFriend";
import {
  SonnerInfo,
  SonnerSuccess,
  SonnerWarning,
} from "@/components/ui/SonnerToast";
import {
  FindFriendByUserName,
  getFriendshipStatus,
  SendRequestToCelebrity,
  SendRequestToFriend,
} from "@/services";
import BouncyLoader from "@/components/ui/Loading/Bouncy";

const FindFriend = () => {
  const [loading, setLoading] = useState(false);
  const [searchTermFind, setSearchTermFind] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [isFocusedFind, setIsFocusedFind] = useState(null);
  const [sending, setSending] = useState(false); // 👉 NEW

  const [friendshipStatus, setFriendshipStatus] = useState("NONE");

  const handleFindFriend = async (username) => {
    if (!username) return;

    try {
      setLoading(true);
      setFoundUser(null);

      const result = await FindFriendByUserName(username);

      if (result?.success) {
        setFoundUser(result.data);

        const status = await getFriendshipStatus(result.data.uid);
        setFriendshipStatus(status);
      } else {
        SonnerInfo("Người dùng không tồn tại");
      }
    } catch (error) {
      SonnerInfo(error.message || "Người dùng không tồn tại");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!foundUser || sending) return;

    try {
      setSending(true);

      if (foundUser?.celebrity) {
        // const res = await SendRequestToCelebrity(foundUser.uid);

        // if (res?.success) {
        //   SonnerSuccess("Gửi thành công!");
        //   setFriendshipStatus("OUTGOING");
        // }
        SonnerWarning("Sắp hỗ trợ điều này");
      } else {
        const res = await SendRequestToFriend(foundUser.uid);

        if (res?.status === "real-user") {
          SonnerSuccess("Đã gửi yêu cầu!");
          setFriendshipStatus("OUTGOING");
        } else {
          SonnerWarning("Gửi thất bại");
        }
      }
    } catch (error) {
      SonnerWarning(error.message || "Lỗi");
    } finally {
      setSending(false);
    }
  };

  const isCelebrity = foundUser?.celebrity === true;

  return (
    <div>
      <h2 className="flex items-center gap-2 text-md font-semibold mb-1">
        <FaSearchPlus size={22} /> Tìm kiếm ai đó?
      </h2>
      <p className="text-sm">Không nên spam quá nhiều.</p>

      <div className="flex gap-2 items-center">
        <SearchInput
          searchTerm={searchTermFind}
          setSearchTerm={setSearchTermFind}
          isFocused={isFocusedFind}
          setIsFocused={setIsFocusedFind}
          placeholder="Thêm một người bạn mới..."
        />

        {searchTermFind && (
          <button
            disabled={loading}
            className="btn btn-base-200 text-base flex items-center gap-2 rounded-full disabled:opacity-50"
            onClick={() => handleFindFriend(searchTermFind)}
          >
            {loading ? (
              <>
                <BouncyLoader size={25} /> Đợi tí
              </>
            ) : (
              "Tìm kiếm"
            )}
          </button>
        )}
      </div>

      <div className="w-full flex justify-center mt-2">
        {foundUser ? (
          isCelebrity ? (
            <CelebItemFriend
              friend={foundUser}
              handleAddFriend={handleAddFriend}
              loading={loading}
            />
          ) : (
            <NormalItemFriend
              friend={foundUser}
              handleAddFriend={handleAddFriend}
              loading={sending}
              disabled={sending}
              status={friendshipStatus}
            />
          )
        ) : (
          <p className="text-gray-400 h-[70px] text-center">
            {loading ? "Đang tìm..." : "Không tìm thấy người dùng nào"}
          </p>
        )}
      </div>
    </div>
  );
};

export default FindFriend;
