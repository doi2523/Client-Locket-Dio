import { useState, useEffect, useRef, useContext } from "react";
import { ArrowUp, MoonStar, SmilePlus, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { GetInfoMoment, SendMessageMoment, SendReactMoment } from "@/services";
import { showError, showSuccess } from "@/components/Toast";
import { getMomentById } from "@/cache/momentDB";
import { AuthContext } from "@/context/AuthLocket";
import LoadingRing from "@/components/ui/Loading/ring";

const LoadingActivityItem = () => (
  <li className="flex items-center gap-3 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-base-300"></div>
    <div className="flex flex-col gap-1 flex-1">
      <div className="h-4 bg-base-300 rounded w-24"></div>
      <div className="h-3 bg-base-300 rounded w-16"></div>
    </div>
  </li>
);

const InputForMoment = () => {
  const { user } = useContext(AuthContext);
  const localId = user?.localId || null;

  const {
    reactionInfo,
    setReactionInfo,
    selectedMomentId,
    showEmojiPicker,
    setShowEmojiPicker,
  } = useApp().post;

  const {
    showFlyingEffect,
    setShowFlyingEffect,
    flyingEmojis,
    setFlyingEmojis,
  } = useApp().navigation;

  const [showFullInput, setShowFullInput] = useState(false);
  const [message, setMessage] = useState("");
  const [reactionPower, setReactionPower] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdingEmoji, setHoldingEmoji] = useState(null);
  const holdInterval = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [momentUser, setMomentUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [activity, setActivity] = useState([]);

  // ✅ Loading states
  const [isLoadingMoment, setIsLoadingMoment] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSendingReaction, setIsSendingReaction] = useState(false);

  // ✅ state modal
  const [showActivityModal, setShowActivityModal] = useState(false);

  // ---- CÁC HÀM CŨ ----
  const sendReact = async (emoji, power = 0) => {
    if (isSendingReaction) return;

    try {
      setIsSendingReaction(true);
      setFlyingEmojis(emoji);
      setShowFlyingEffect(true);
      const res = await SendReactMoment(emoji, selectedMomentId, power);
      showSuccess(`Gửi cảm xúc thành công!`);
      setShowEmojiPicker(false);
    } catch (error) {
      showError("Gửi cảm xúc thất bại!");
      console.error("Lỗi khi gửi react:", error);
    } finally {
      setIsSendingReaction(false);
    }
  };

  const handleHoldStart = (emoji) => {
    if (isSendingReaction) return;

    setIsHolding(true);
    setHoldingEmoji(emoji);
    setReactionPower(0);
    holdInterval.current = setInterval(() => {
      setReactionPower((prev) => (prev >= 1000 ? 1000 : prev + 1));
    }, 0.1);
  };

  const handleHoldEnd = (emoji) => {
    if (holdInterval.current) clearInterval(holdInterval.current);
    if (isHolding && !isSendingReaction) sendReact(emoji, reactionPower);
    setIsHolding(false);
    setHoldingEmoji(null);
    setReactionPower(0);
  };

  const getUserFromFriendDetails = (uid) => {
    if (!uid) return null;
    try {
      const data = localStorage.getItem("friendDetails");
      if (!data) return null;
      const users = JSON.parse(data);
      return users.find((user) => user.uid === uid) || null;
    } catch (error) {
      console.error("Lỗi khi đọc friendDetails:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchMomentAndUser = async () => {
      try {
        setIsLoadingMoment(true);
        const moment = await getMomentById(selectedMomentId);
        setMomentUser(moment.user);
        const data = await getUserFromFriendDetails(moment.user);
        setUserDetail(data);
      } catch (err) {
        console.error("Lỗi khi lấy moment hoặc user:", err);
      } finally {
        setIsLoadingMoment(false);
      }
    };

    if (selectedMomentId) {
      fetchMomentAndUser();
    }
  }, [selectedMomentId]);

  const handleSend = async () => {
    if (isSendingMessage || !message.trim()) return;

    try {
      setIsSendingMessage(true);
      const moment = await getMomentById(selectedMomentId);
      await SendMessageMoment(message, moment.id, moment.user);
      setMessage("");
      setShowFullInput(false);
      showSuccess("Gửi tin nhắn thành công!");
    } catch (error) {
      showError("Gửi tin nhắn thất bại!");
      console.error("❌ Lỗi khi gửi message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const fullName = `${userDetail?.firstName || ""} ${
    userDetail?.lastName || ""
  }`.trim();
  const shortName =
    fullName.length > 10 ? fullName.slice(0, 10) + "…" : fullName;

  useEffect(() => {
    if (localId && momentUser && localId === momentUser && selectedMomentId) {
      const fetchMyMoment = async () => {
        try {
          setIsLoadingActivity(true);
          const info = await GetInfoMoment(selectedMomentId);
          const { views = [], reactions = [] } = info;
          // Map qua từng view, gắn thêm userInfo + reaction (nếu có)
          const merged = await Promise.all(
            views.map(async (view) => {
              const userInfo = await getUserFromFriendDetails(view.user);
              const reaction = reactions.find((r) => r.user === view.user);

              return {
                user: userInfo,
                viewedAt: view.viewedAt,
                reaction: reaction
                  ? {
                      emoji: reaction.emoji,
                      intensity: reaction.intensity,
                      createdAt: reaction.createdAt,
                    }
                  : null,
              };
            })
          );

          setActivity(merged);
        } catch (err) {
          console.error("❌ Lỗi khi gọi GetInfoMoment:", err);
        } finally {
          setIsLoadingActivity(false);
        }
      };

      fetchMyMoment();
    }
  }, [localId, momentUser, selectedMomentId]);

  return (
    <>
      {localId && momentUser && localId === momentUser ? (
        <div className="w-full">
          <div className="relative w-full">
            <div
              className="flex flex-row justify-center w-full items-center gap-2 px-4 py-3.5 bg-base-200 rounded-3xl shadow-md cursor-pointer"
              onClick={() => setShowActivityModal(true)}
            >
              <div>
                <MoonStar className="text-base-content w-6 h-6" />
              </div>
              <span className="flex-1 text-base-content font-semibold pl-1">
                Hoạt động
              </span>
              {/* Danh sách avatar xếp chồng */}
              <div className="absolute z-10 flex -space-x-3 right-5 flex-row justify-center items-center">
                {isLoadingActivity ? (
                  <LoadingRing size={28} />
                ) : (
                  activity
                    .slice(0, 6)
                    .map((item) => (
                      <img
                        key={item?.user?.uid}
                        src={item?.user?.profilePic}
                        alt={item?.user?.firstName}
                        className="w-9 h-9 rounded-full border-base-100"
                      />
                    ))
                )}
              </div>
            </div>
          </div>

          {/* ✅ Modal Hoạt động */}
          <div
            className={`fixed inset-0 z-60 flex items-end bg-black/50 duration-300 transition-all ${
              showActivityModal
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className={`relative w-full h-2/3 bg-base-100 rounded-t-3xl shadow-lg p-4 transform transition-transform duration-300 ${
                showActivityModal ? "translate-y-0" : "translate-y-full"
              }`}
            >
              {/* Header */}
              <div className="relative flex items-center mb-4">
                <h2 className="text-lg font-bold text-center flex-1">
                  Hoạt động
                </h2>
                <button
                  onClick={() => setShowActivityModal(false)}
                  className="absolute right-0 p-2 rounded-full hover:bg-base-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Nội dung cuộn */}
              <div className="overflow-y-auto h-[calc(100%-3rem)]">
                {isLoadingActivity ? (
                  <ul className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <LoadingActivityItem key={i} />
                    ))}
                  </ul>
                ) : activity.length > 0 ? (
                  <ul className="space-y-2">
                    {activity.map((item) => (
                      <li
                        key={item?.user?.uid}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={item?.user?.profilePic}
                          alt={item?.user?.firstName}
                          className="w-12 h-12 rounded-full border-[2.5px] p-0.5 border-amber-400"
                        />
                        <div className="flex flex-col">
                          <span className="text-base text-base-content font-semibold">
                            {item.user?.firstName} {item.user?.lastName}
                          </span>
                          {item.reaction ? (
                            <span className="text-sm">
                              đã reaction {item?.reaction?.emoji}
                            </span>
                          ) : (
                            <span className="text-sm">✨ đã xem</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-full text-base-content/60 italic">
                    Chưa có hoạt động nào
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ✅ Input hiện khi gõ */}
          {showFullInput && (
            <div ref={wrapperRef} className="z-50 w-full">
              <div className="relative w-full">
                <div className="flex w-full items-center gap-3 px-4 py-3.5 bg-base-200 rounded-3xl shadow-md">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={`Trả lời ${shortName}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSendingMessage}
                    className="flex-1 bg-transparent focus:outline-none font-semibold pl-1 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isSendingMessage || !message.trim()}
                    className="btn absolute right-3 p-1 btn-sm bg-base-300 btn-circle flex justify-center items-center disabled:opacity-50"
                  >
                    {isSendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-base-content"></div>
                    ) : (
                      <ArrowUp className="text-base-content w-7 h-7" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Khung rút gọn */}
          {!showFullInput && (
            <div className="w-full">
              <div className="relative w-full">
                <div
                  className="flex items-center w-full px-4 py-3.5 rounded-3xl bg-base-200 shadow-md cursor-text"
                  onClick={() => setShowFullInput(true)}
                >
                  <span className="flex-1 text-md text-base-content/60 font-semibold pl-1">
                    Gửi tin nhắn...
                  </span>
                </div>

                {/* ✅ Icon cảm xúc */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-4 pointer-events-auto px-2">
                  {["🤣", "💛", "💩"].map((emoji) => (
                    <button
                      key={emoji}
                      title={emoji}
                      disabled={isSendingReaction}
                      onMouseDown={() => handleHoldStart(emoji)}
                      onMouseUp={() => handleHoldEnd(emoji)}
                      onMouseLeave={() => handleHoldEnd(emoji)}
                      onTouchStart={() => handleHoldStart(emoji)}
                      onTouchEnd={() => handleHoldEnd(emoji)}
                      className={`cursor-pointer select-none text-3xl transition-transform disabled:opacity-50 ${
                        holdingEmoji === emoji ? "shake" : ""
                      } ${isSendingReaction ? "pointer-events-none" : ""}`}
                    >
                      <span>{emoji}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={isSendingReaction}
                    className="cursor-pointer relative disabled:opacity-50"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <SmilePlus className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default InputForMoment;
