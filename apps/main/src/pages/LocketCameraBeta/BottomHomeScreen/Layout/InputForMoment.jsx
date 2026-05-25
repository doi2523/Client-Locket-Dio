import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowUp, SmilePlus } from "lucide-react";
import clsx from "clsx";
import { useApp } from "@/context/AppContext";
import { SendMessageMoment, SendReactMoment } from "@/services";
import { getMomentById } from "@/cache/momentDB";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import { getFriendDetail } from "@/cache/friendsDB";
import ActivitySection from "../Modal/ActivityViews/ActivityModal";
import { markMomentViewedOnce } from "@/cache/viewedMomentDB";
import {
  useAuthStore,
  useMomentsStoreV2,
  useMomentActivityStore,
  useSelectedStore,
  useUserSetting,
  resolveMyUid,
  resolveMomentOwnerUid,
} from "@/stores";
import ReactionEffect from "@/components/Effects/ReactionEffect";

const InputForMoment = () => {
  const { user } = useAuthStore();
  const myUid = resolveMyUid(user);

  const selectedMomentId = useSelectedStore((s) => s.selectedMomentId);
  const selectedFriendUid = useSelectedStore((s) => s.selectedFriendUid);

  const selectedKey = selectedFriendUid ?? "all";
  const moments =
    useMomentsStoreV2((s) => s.momentsByUser[selectedKey]?.moments) ?? [];

  const knownOwnerFromList = useMemo(() => {
    if (!selectedMomentId) return null;
    const m = moments.find((item) => item.id === selectedMomentId);
    return resolveMomentOwnerUid(m);
  }, [moments, selectedMomentId]);

  const syncForSelectedMoment = useMomentActivityStore(
    (s) => s.syncForSelectedMoment,
  );
  const clearActive = useMomentActivityStore((s) => s.clearActive);
  const activityEntry = useMomentActivityStore((s) =>
    selectedMomentId ? s.byMomentId[selectedMomentId] : null,
  );

  const { setShowEmojiPicker } = useApp().post;

  const [showFullInput, setShowFullInput] = useState(false);
  const [message, setMessage] = useState("");
  const [reactionPower, setReactionPower] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [holdingEmoji, setHoldingEmoji] = useState(null);
  const holdInterval = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  // thêm state
  const [reactionEffectEmoji, setReactionEffectEmoji] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [isLoadingMomentMeta, setIsLoadingMomentMeta] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSendingReaction, setIsSendingReaction] = useState(false);

  const ownerUid = activityEntry?.ownerUid ?? knownOwnerFromList;
  const isOwnMoment = Boolean(myUid && ownerUid && myUid === ownerUid);
  const isPublic = activityEntry?.isPublic ?? true;
  const activity = activityEntry?.activity ?? [];
  const pollCounts = activityEntry?.pollCounts ?? null;
  const isLoadingActivity = activityEntry?.loading ?? false;

  useEffect(() => {
    if (!selectedMomentId) {
      clearActive();
      setUserDetail(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsLoadingMomentMeta(true);

      await syncForSelectedMoment({
        momentId: selectedMomentId,
        myUid,
        ownerUid: knownOwnerFromList,
      });

      if (cancelled || !selectedMomentId) return;

      const entry =
        useMomentActivityStore.getState().byMomentId[selectedMomentId];
      const resolvedOwner = entry?.ownerUid ?? knownOwnerFromList;

      if (!resolvedOwner || resolvedOwner === myUid) {
        setUserDetail(null);
        setIsLoadingMomentMeta(false);
        return;
      }

      try {
        const data = await getFriendDetail(resolvedOwner);
        if (!cancelled) setUserDetail(data);
      } catch (err) {
        console.error("Lỗi khi lấy user detail:", err);
      } finally {
        if (!cancelled) setIsLoadingMomentMeta(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    selectedMomentId,
    myUid,
    knownOwnerFromList,
    syncForSelectedMoment,
    clearActive,
  ]);

  const showSeenMoments = useUserSetting((s) => s.showSeenMoments);

  useEffect(() => {
    if (!selectedMomentId || !ownerUid || isOwnMoment) return;
    if (!showSeenMoments) return;

    const markViewed = async () => {
      try {
        await markMomentViewedOnce({
          id: selectedMomentId,
          user: ownerUid,
        });
      } catch (err) {
        console.error("❌ Lỗi mark viewed:", err);
      }
    };

    markViewed();
  }, [selectedMomentId, ownerUid, isOwnMoment, showSeenMoments]);

  const sendReact = async (emoji, power = 0) => {
    if (isSendingReaction || !selectedMomentId) return;

    try {
      setIsSendingReaction(true);

      // trigger effect
      await SendReactMoment(emoji, selectedMomentId, power);
      setReactionEffectEmoji(emoji);
      SonnerSuccess("Gửi cảm xúc thành công!");
      setShowEmojiPicker(false);
    } catch (error) {
      SonnerError("Gửi cảm xúc thất bại!");
      console.error("Lỗi khi gửi react:", error);
    } finally {
      setIsSendingReaction(false);

      // reset để lần sau trigger lại
      setTimeout(() => {
        setReactionEffectEmoji(null);
      }, 10000);
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

  const handleSend = async () => {
    if (isSendingMessage || !message.trim() || !selectedMomentId) return;

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
    if (!showFullInput) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowFullInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showFullInput]);

  if (!selectedMomentId) return null;

  if (isOwnMoment) {
    return (
      <ActivitySection
        isPublic={isPublic}
        activity={activity}
        pollCounts={pollCounts}
        isLoading={isLoadingActivity || isLoadingMomentMeta}
      />
    );
  }

  return (
    <>
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
                  isSendingMessage || !message.trim() || userDetail?.isCelebrity
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

      {!showFullInput && (
        <div className="w-full">
          <div className="relative w-full">
            <div
              className={clsx(
                "flex items-center w-full px-4 py-3.5 rounded-3xl bg-base-200 shadow-md",
                userDetail?.isCelebrity
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-text",
              )}
              onClick={() => {
                if (!userDetail?.isCelebrity) setShowFullInput(true);
              }}
            >
              <span className="flex-1 text-md text-base-content/60 font-semibold pl-1">
                Gửi tin nhắn...
              </span>
            </div>

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

      <ReactionEffect
        emojis={reactionEffectEmoji ? [reactionEffectEmoji] : []}
        count={25}
        direction="up"
        running={Boolean(reactionEffectEmoji)}
      />
    </>
  );
};

export default InputForMoment;
