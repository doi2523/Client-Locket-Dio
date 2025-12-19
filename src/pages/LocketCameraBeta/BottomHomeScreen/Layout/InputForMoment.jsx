import { useState, useEffect, useRef, useContext } from "react";
import { ArrowUp, SmilePlus } from "lucide-react";
import clsx from "clsx";
import { useApp } from "@/context/AppContext";
import { GetInfoMoment, SendMessageMoment, SendReactMoment } from "@/services";
import { getMomentById } from "@/cache/momentDB";
import { AuthContext } from "@/context/AuthLocket";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import { getFriendDetail } from "@/cache/friendsDB";
import ActivitySection from "../Modal/ActivityViews/ActivityModal";
import { markMomentViewedOnce } from "@/cache/viewedMomentDB";

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
  const [isPublic, setIsPublic] = useState(true);

  const [activity, setActivity] = useState([]);

  // ✅ Loading states
  const [isLoadingMoment, setIsLoadingMoment] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSendingReaction, setIsSendingReaction] = useState(false);

  // ---- CÁC HÀM CŨ ----
  const sendReact = async (emoji, power = 0) => {
    if (isSendingReaction) return;

    try {
      setIsSendingReaction(true);
      setFlyingEmojis(emoji);
      setShowFlyingEffect(true);
      const res = await SendReactMoment(emoji, selectedMomentId, power);
      SonnerSuccess(`Gửi cảm xúc thành công!`);
      setShowEmojiPicker(false);
    } catch (error) {
      SonnerError("Gửi cảm xúc thất bại!");
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

  useEffect(() => {
    const fetchMomentAndUser = async () => {
      try {
        setIsLoadingMoment(true);
        const moment = await getMomentById(selectedMomentId);
        setIsPublic(moment.isPublic);
        setMomentUser(moment.user);
        const data = await getFriendDetail(moment.user);
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

  useEffect(() => {
    if (!selectedMomentId || !momentUser) return;

    const markViewed = async () => {
      try {
        // await markMomentViewedOnce({
        //   id: selectedMomentId,
        //   user: momentUser,
        // });
      } catch (err) {
        console.error("❌ Lỗi mark viewed:", err);
      }
    };

    markViewed();
  }, [selectedMomentId, momentUser]);

  const handleSend = async () => {
    if (isSendingMessage || !message.trim()) return;

    try {
      setIsSendingMessage(true);
      const moment = await getMomentById(selectedMomentId);
      await SendMessageMoment(message, moment.id, moment.user);
      setMessage("");
      setShowFullInput(false);
      SonnerSuccess("Gửi tin nhắn thành công!");
    } catch (error) {
      SonnerError("Gửi tin nhắn thất bại!");
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
              const userInfo = await getFriendDetail(view.user);
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

  useEffect(() => {
    if (!showFullInput) return; // chỉ chạy khi đang mở input

    const handleClickOutside = (e) => {
      // nếu click bên ngoài vùng input
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowFullInput(false);
      }
    };

    // lắng nghe click
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showFullInput]);

  return (
    <>
      {localId && momentUser && localId === momentUser ? (
        <ActivitySection
          isPublic={isPublic}
          activity={activity}
          isLoading={isLoadingActivity}
        />
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
                    disabled={isSendingMessage || userDetail?.isCelebrity}
                    className="flex-1 bg-transparent focus:outline-none font-semibold pl-1 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={
                      isSendingMessage ||
                      !message.trim() ||
                      userDetail?.isCelebrity
                    }
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
                  className={clsx(
                    "flex items-center w-full px-4 py-3.5 rounded-3xl bg-base-200 shadow-md",
                    userDetail?.isCelebrity
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-text"
                  )}
                  onClick={() => {
                    if (!userDetail?.isCelebrity) setShowFullInput(true);
                  }}
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
