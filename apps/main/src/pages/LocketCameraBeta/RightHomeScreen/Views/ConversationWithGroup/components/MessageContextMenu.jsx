import React from "react";
import ReactDOM from "react-dom";
import { SonnerInfo } from "@/components/ui/SonnerToast";
import { QUICK_EMOJIS, EMOJI_GRID } from "./constants";

export const MessageContextMenu = ({
  showMenu,
  showEmojiPicker,
  menuPos,
  myReaction,
  content,
  onClose,
  onShowEmojiPicker,
  onSendReaction,
}) => {
  if (!showMenu) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999]" onClick={onClose}>
      {showEmojiPicker ? (
        <div
          className="fixed bg-base-100 shadow-xl border border-base-300 rounded-2xl overflow-hidden w-72 max-h-80"
          style={{ left: Math.min(menuPos.x, window.innerWidth - 288), top: Math.max(menuPos.y - 320, 8) }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 p-3 border-b border-base-200">
            <button className="btn btn-ghost btn-xs p-1" onClick={() => onShowEmojiPicker(false)}>
              ←
            </button>
            <span className="font-semibold text-sm">Chọn emoji</span>
          </div>
          <div className="grid grid-cols-8 gap-1 p-3 overflow-y-auto max-h-64">
            {EMOJI_GRID.map((emoji) => (
              <button
                key={emoji}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xl ${
                  myReaction === emoji ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-base-200"
                }`}
                onClick={() => onSendReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="fixed flex flex-col gap-2"
          style={{
            left: Math.min(menuPos.x - (window.innerWidth < 640 ? 40 : 0), window.innerWidth - 200),
            top: Math.max(menuPos.y - 16, 8),
            transform: "translateY(-100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1 bg-base-100 shadow-lg border border-base-300 rounded-full p-1.5 self-start">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-xl active:scale-110 transition-transform ${
                  myReaction === emoji ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-base-200"
                }`}
                onClick={() => onSendReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="bg-base-100 shadow-lg text-base-content border border-base-300 rounded-2xl overflow-hidden min-w-[180px]">
            <button
              className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 w-full text-left text-sm font-medium"
              onClick={() => onShowEmojiPicker(true)}
            >
              <span className="text-lg">😊</span>
              <span>Reaction</span>
            </button>
            {content.type !== "moment" && (
              <button
                className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 w-full text-left text-sm font-medium"
                onClick={() => {
                  navigator.clipboard.writeText(content.content || "");
                  SonnerInfo("Đã sao chép");
                  onClose();
                }}
              >
                <span className="text-lg">📋</span>
                <span>Sao chép</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
