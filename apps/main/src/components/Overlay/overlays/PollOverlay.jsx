import { useState } from "react";
import { SonnerError, SonnerSuccess } from "@/components/ui/SonnerToast";
import { getCaptionStyle } from "@/helpers/styleHelpers";
import { SendReactMoment } from "@/services";
import { useReactionStore } from "@/stores";

/**
 * pollVariant:
 * - "owner"  — moment của bản thân: chỉ hiển thị số vote
 * - "friend" — moment bạn bè: nút bấm để vote 👍/👎
 */
function PollOverlay({
  overlayData,
  pollCounts,
  pollVariant = "friend",
  momentId,
}) {
  const pollData = overlayData?.payload || overlayData?.overlays?.payload || {};
  const isOwnerView = pollVariant === "owner";

  const backgroundColors = overlayData?.background?.colors || [
    "#685AF7",
    "#685AF7",
  ];

  const rightEmoji = pollCounts?.rightEmoji || pollData.right_emoji || "👍";
  const leftEmoji = pollCounts?.leftEmoji || pollData.left_emoji || "👎";

  const leftCount = pollCounts?.leftCount ?? 0;
  const rightCount = pollCounts?.rightCount ?? 0;
  const showCounts = isOwnerView && Boolean(pollCounts?.isPoll);

  const pollText = overlayData?.text;
  const textColor = overlayData?.text_color || "#FFFFFF";

  const [votingEmoji, setVotingEmoji] = useState(null);
  const [myVote, setMyVote] = useState(null);

  const triggerReaction = useReactionStore((s) => s.triggerReaction);

  const handleVote = async (emoji) => {
    if (!momentId || votingEmoji) return;

    try {
      setVotingEmoji(emoji);
      await SendReactMoment(emoji, momentId, 0);
      setMyVote(emoji);
      triggerReaction(emoji);
      SonnerSuccess("Đã gửi vote!");
    } catch (err) {
      console.error("Poll vote failed:", err);
      SonnerError("Gửi vote thất bại!");
    } finally {
      setVotingEmoji(null);
    }
  };

  const shellClass =
    "absolute bottom-4 left-1/2 z-20 flex w-max max-w-[80%] -translate-x-1/2 flex-col items-center rounded-3xl bg-white/50 p-2 font-semibold backdrop-blur-2xl";

  const optionBase =
    "flex flex-1 flex-row items-center justify-center gap-2 rounded-3xl px-5 py-1 text-xl shadow-md backdrop-blur-md transition";

  return (
    <>
      <div
        className={shellClass}
        style={getCaptionStyle(backgroundColors, textColor)}
      >
        {pollText && (
          <div className="mb-3 text-center" style={{ color: textColor }}>
            {pollText}
          </div>
        )}

        <div className="flex w-full items-center gap-2">
          {isOwnerView ? (
            <>
              <div
                className={`${optionBase} bg-white/10`}
                aria-label={`${leftEmoji} ${leftCount} votes`}
              >
                <span>{leftEmoji}</span>
                {showCounts && (
                  <span
                    className="text-md font-bold tabular-nums -rotate-6"
                    style={{
                      color: "#685AF7",
                      textShadow: `
      -1px -1px 0 white,
       1px -1px 0 white,
      -1px  1px 0 white,
       1px  1px 0 white
    `,
                    }}
                  >
                    {leftCount}
                  </span>
                )}
              </div>
              <div
                className={`${optionBase} bg-white/10`}
                aria-label={`${rightEmoji} ${rightCount} votes`}
              >
                <span>{rightEmoji}</span>
                {showCounts && (
                  <span
                    className="text-md font-bold tabular-nums -rotate-6"
                    style={{
                      color: "#685AF7",
                      textShadow: `
      -1px -1px 0 white,
       1px -1px 0 white,
      -1px  1px 0 white,
       1px  1px 0 white
    `,
                    }}
                  >
                    {rightCount}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={Boolean(votingEmoji)}
                onClick={() => handleVote(leftEmoji)}
                className={`${optionBase} bg-white/10 active:scale-95 hover:bg-white/20 disabled:opacity-60 ${
                  myVote === leftEmoji ? "ring-2 ring-white/80" : ""
                }`}
              >
                <span>{leftEmoji}</span>
                {votingEmoji === leftEmoji && (
                  <span className="loading loading-spinner loading-xs" />
                )}
              </button>
              <button
                type="button"
                disabled={Boolean(votingEmoji)}
                onClick={() => handleVote(rightEmoji)}
                className={`${optionBase} bg-white/10 active:scale-95 hover:bg-white/20 disabled:opacity-60 ${
                  myVote === rightEmoji ? "ring-2 ring-white/80" : ""
                }`}
              >
                <span>{rightEmoji}</span>
                {votingEmoji === rightEmoji && (
                  <span className="loading loading-spinner loading-xs" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PollOverlay;
