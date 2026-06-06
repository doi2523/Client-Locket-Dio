import React, { useState, useRef } from "react";
import { ArrowUp } from "lucide-react";

const InputGroupChatDetail = ({ selectedChat }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const MAX_ROWS = 6;

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    // Logic gửi tin nhắn nhóm sẽ được thêm sau bởi người dùng
    console.log("Gửi tin nhắn nhóm:", {
      groupId: selectedChat?.uid,
      message: message.trim(),
    });

    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
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

  const disabled = loading || !message.trim();

  return (
    <div className="">
      <div className="flex w-full items-end gap-3 px-4 py-3.5 bg-base-200 rounded-3xl shadow-md relative">
        <textarea
          ref={textareaRef}
          placeholder="Gửi tin nhắn nhóm..."
          value={message}
          onChange={handleChange}
          rows={1}
          className="flex-1 bg-transparent focus:outline-none font-semibold pl-1 pr-7 resize-none disabled:opacity-50 leading-6 overflow-y-auto"
          disabled={loading}
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
