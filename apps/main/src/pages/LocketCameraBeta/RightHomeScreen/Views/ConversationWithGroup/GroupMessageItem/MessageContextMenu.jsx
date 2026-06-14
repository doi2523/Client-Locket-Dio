import clsx from "clsx";
import { Laugh, Undo2 } from "lucide-react";
import { QUICK_EMOJIS } from "./constants";

export function MessageContextMenu({
  show,
  isMe,
  content,
  myReaction,
  onReaction,
  onCopy,
  onRecall,
  onReport,
}) {
  if (!show) return null;

  return (
    <>
      {!isMe && (
        <div
          className={clsx(
            "absolute bottom-full mb-2 flex gap-1 bg-base-100 shadow-lg border border-base-300 rounded-full p-1.5 w-fit z-[60]",
            {
              "left-0": !isMe,
              "right-0": isMe,
            },
          )}
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReaction?.(emoji)}
              className={clsx(
                "w-9 h-9 flex items-center justify-center rounded-full text-xl",
                {
                  "bg-primary/20 ring-2 ring-primary": myReaction === emoji,
                },
              )}
            >
              {emoji}
            </button>
          ))}

          <button className="w-9 h-9 flex items-center justify-center rounded-full">
            <Laugh size={23} />
          </button>
        </div>
      )}

      <div
        className={clsx(
          "absolute top-full mt-2 bg-base-100 shadow-lg border border-base-300 rounded-2xl overflow-hidden min-w-[180px] z-[60]",
          {
            "right-0": isMe,
            "left-0": !isMe,
          },
        )}
      >
        {content.type !== "moment" && (
          <button
            onClick={onCopy}
            className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 w-full text-left text-sm font-medium"
          >
            <span className="text-lg">📋</span>
            <span>Sao chép</span>
          </button>
        )}

        {isMe ? (
          <button
            onClick={onRecall}
            className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 w-full text-left text-sm font-medium"
          >
            <Undo2 size={22} />
            <span>Thu hồi</span>
          </button>
        ) : (
          <button
            onClick={onReport}
            className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 w-full text-left text-sm font-medium"
          >
            <span className="text-lg">🚩</span>
            <span>Báo cáo</span>
          </button>
        )}
      </div>
    </>
  );
}
