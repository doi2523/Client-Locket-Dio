import React, { useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { sendGroupMessage } from "@/services";
import { SonnerInfo } from "@/components/ui/SonnerToast";

const InputGroupChatDetail = ({ selectedChat, chat_disabled = false }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const MAX_ROWS = 6;

  const handleSend = async () => {
    const text = message.trim();
    if (!text || loading || !selectedChat?.uid) return;

    setLoading(true);
    const sentText = text;
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await sendGroupMessage({
        groupId: selectedChat.uid,
        message: sentText,
      });
    } catch (err) {
      console.error("sendGroupMessage error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    const target = e.target;
    target.style.height = "auto";

    const lineHeight = 24;
    const maxHeight = lineHeight * MAX_ROWS;

    target.style.height =
      target.scrollHeight > maxHeight
        ? maxHeight + "px"
        : target.scrollHeight + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const disabled = loading || !message.trim();

  return (
    <div className="flex flex-row items-center gap-3">
      {/* CAMERA BUTTON */}
      <button
        onClick={() => SonnerInfo("Đang được thi công!")}
        className="relative flex items-center justify-center w-10 h-10 shrink-0"
      >
        <div className="absolute w-8 h-8 ring-4 text-primary rounded-full z-10" />
        <div className="absolute w-7 h-7 rounded-full bg-base-100 shadow-sm" />
      </button>

      {/* INPUT */}
      <div className="flex-1 flex items-end gap-3 px-4 py-3.5 bg-base-200 rounded-3xl shadow-md relative">
        <textarea
          ref={textareaRef}
          placeholder={
            chat_disabled
              ? "Bạn không phải là thành viên của nhóm này"
              : "Gửi tin nhắn nhóm..."
          }
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 bg-transparent focus:outline-none font-semibold pl-1 pr-7 resize-none disabled:opacity-50 leading-6 overflow-y-auto"
          disabled={loading || chat_disabled}
        />
        <button
          onClick={handleSend}
          disabled={disabled}
          className="btn absolute right-3 bottom-3 p-1 btn-sm bg-base-300 btn-circle flex justify-center items-center disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-base-content"></div>
          ) : (
            <ArrowUp className="text-base-content w-7 h-7" />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputGroupChatDetail;
