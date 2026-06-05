// ================= Component: MessageItem =================
const MessageItem = ({ msg, selectedChat }) => {
  const me = localStorage.getItem("localId");
  const isMe = msg.sender === me;

  return (
    <div className={`chat ${isMe ? "chat-end" : "chat-start"}`} key={msg.id}>
      {/* Nội dung */}
      <div className="chat-bubble relative">
        {/* Reply */}
        {msg.reply_moment && (
          <div className="text-sm italic opacity-70">↪ {msg.reply_moment}</div>
        )}

        {/* Ảnh thumbnail */}
        {msg.thumbnail_url && (
          <img
            src={msg.thumbnail_url}
            alt="thumbnail"
            className="w-32 h-32 object-cover rounded-lg my-1"
          />
        )}

        {/* Text */}
        {msg.text}

        {/* Reactions */}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className="absolute -top-4 -right-2 flex gap-1 bg-base-200 p-1 rounded-full shadow text-sm">
            {msg.reactions.map((r, idx) => (
              <span key={idx} title={r.sender}>
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thời gian */}
      <div className="chat-footer opacity-50 text-xs">
        {new Date(Number(msg.create_time) * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default MessageItem;
