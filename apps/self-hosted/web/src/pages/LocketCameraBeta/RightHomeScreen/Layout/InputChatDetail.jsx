import React, { useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { sendMessage } from "@/services";
import { SonnerSuccess } from "@/components/ui/SonnerToast";

const ChatDetailFooter = ({ selectedChat }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const MAX_ROWS = 6; // số dòng tối đa

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      const messageData = {
        sender: localStorage.getItem("localId"),
        receiver_uid: selectedChat?.friend.uid,
        message: message.trim(),
      };

      const res = await sendMessage(messageData);

      if (res?.result?.status === 200) {
        // SonnerSuccess(
        //   "Gửi tin nhắn thành công!",
        //   `Người nhận: ${selectedChat?.friend.firstName || "Unknown"} ${
        //     selectedChat?.friend.lastName || "Unknown"
        //   }`
        // );
        setMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"; // reset lại
        }
      } else {
        console.warn("Send message failed:", res);
      }
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    const target = e.target;
    target.style.height = "auto"; // reset để tính lại

    const lineHeight = 24; // px (nên khớp với leading-6 = 1.5rem)
    const maxHeight = lineHeight * MAX_ROWS;

    // nếu chiều cao vượt quá maxHeight thì giữ maxHeight và cho scroll
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
          placeholder="Gửi tin nhắn..."
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

export default ChatDetailFooter;
