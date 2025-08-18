import ChatDetailHeader from "../Layout/HeaderChatDetail";

const ChatDetail = ({ selectedChat, setSelectedChat }) => {
  return (
    <div
      className={`fixed inset-0 z-60 flex flex-col transition-transform duration-500 bg-base-100 
        ${selectedChat ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header - sticky */}
      <div className="sticky top-0 z-10 bg-base-100">
        <ChatDetailHeader
          selectedChat={selectedChat}
          onBack={() => setSelectedChat(null)}
        />
      </div>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4">
        <p>Đang hiển thị chat với UID: {selectedChat?.uid}</p>
        {selectedChat?.friend && (
          <div className="mt-4">
            <img
              src={
                selectedChat.friend.profilePic ||
                "/default-avatar.png"
              }
              alt="avatar"
              className="w-20 h-20 rounded-full border"
            />
            <p className="mt-2 font-semibold">
              {selectedChat.friend.firstName} {selectedChat.friend.lastName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
