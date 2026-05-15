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
  shareHistoryWithFriend,
} from "@/services";
import BouncyLoader from "@/components/ui/Loading/Bouncy";
import { useFeatureVisible } from "@/hooks/useFeature";
import { useNavigate } from "react-router-dom";
import { useShareHistory } from "@/stores";

const FindFriend = () => {
  const navigate = useNavigate();
  const isSendRequest = useFeatureVisible("send_friend_request");

  const { shareHistoryOn, toggleShareHistoryOn } = useShareHistory();

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

    if (!isSendRequest) {
      SonnerWarning(
        "Tính năng bị khoá!",
        "Nâng cấp gói để gửi yêu cầu kết bạn.",
        {
          action: {
            label: "Nâng cấp",
            onClick: () => {
              navigate("/pricing");
            },
          },
        },
      );
      return;
    }
    try {
      setSending(true);

      if (foundUser?.celebrity) {
        const res = await SendRequestToCelebrity(foundUser.uid);

        if (res?.success) {
          SonnerSuccess("Gửi thành công!");
          setFriendshipStatus("OUTGOING");
          setFoundUser((prev) => ({
            ...prev,
            friendship_status: "outgoing-follow-request",
          }));
        }
      } else {
        const res = await SendRequestToFriend(foundUser.uid);

        if (res?.status === "real-user") {
          SonnerSuccess("Đã gửi yêu cầu!");
          setFriendshipStatus("OUTGOING");
          if (shareHistoryOn) {
            SonnerInfo("Lịch sử sẽ được chia sẻ nếu họ chấp nhận yêu cầu.");
            await shareHistoryWithFriend(foundUser.uid);
          }
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

      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">Chia sẻ lịch sử?</p>
            <p className="text-sm text-base-content/60">
              Tự động chia sẻ lịch sử ảnh trong 30 ngày gần đây cho họ.
            </p>
          </div>
        </div>

        <input
          type="checkbox"
          checked={shareHistoryOn}
          onChange={toggleShareHistoryOn}
          className="toggle toggle-secondary"
        />
      </div>

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
