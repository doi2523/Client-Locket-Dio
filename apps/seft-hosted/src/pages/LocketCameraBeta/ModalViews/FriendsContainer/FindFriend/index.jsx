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
import { FindFriendByUserName, SendRequestToCelebrity } from "@/services";
import BouncyLoader from "@/components/ui/Loading/Bouncy";

const FindFriend = () => {
  const [loading, setLoading] = useState(false);
  const [searchTermFind, setSearchTermFind] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [isFocusedFind, setIsFocusedFind] = useState(null);

  const handleFindFriend = async (username) => {
    if (!username) return;

    try {
      setLoading(true);
      const result = await FindFriendByUserName(username);

      if (result?.success === true) {
        setFoundUser(result.data);
      } else {
        setFoundUser(null);
        SonnerInfo("Người dùng không tồn tại");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tìm bạn:", error);
      setFoundUser(null);
      SonnerInfo(error.message || "Người dùng không tồn tại");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!foundUser) return;

    try {
      setLoading(true);

      if (foundUser?.celebrity === true) {
        await SendRequestToCelebrity(foundUser.uid);
        SonnerSuccess("Gửi lời mời thành công!");

        // 👉 fetch lại để cập nhật friendship_status mới
        await handleFindFriend(searchTermFind);
      } else {
        SonnerWarning("Chưa hỗ trợ tính năng này!");
      }
    } catch (error) {
      console.error("❌ Lỗi gửi yêu cầu:", error);
      SonnerWarning(error.message || "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const isCelebrity = foundUser?.celebrity === true;

  return (
    <div>
      <h2 className="flex items-center gap-2 text-md font-semibold mb-1">
        <FaSearchPlus size={22} /> Tìm kiếm ai đó?
      </h2>

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
            className="btn btn-base-200 text-base flex items-center gap-2 rounded-full"
            onClick={() => handleFindFriend(searchTermFind)}
          >
            {loading ? (
              <>
                <BouncyLoader size={25} color="orange"/> Đợi tí
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
              loading={loading}
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
