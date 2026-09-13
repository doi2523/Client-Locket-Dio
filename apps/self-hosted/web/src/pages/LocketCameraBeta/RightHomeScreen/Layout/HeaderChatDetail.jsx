import { ChevronLeft, Ellipsis } from "lucide-react";

const ChatDetailHeader = ({ selectedChat, onBack }) => {
  return (
    <div className="flex items-center justify-between shadow-lg px-4 py-2">
      {/* Left */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer"
        >
          <ChevronLeft size={30} />
        </button>
      </div>

      {/* Center */}
      <div className="flex-1 flex justify-center items-center flex-row gap-3 text-center">
        <img
          src={
            selectedChat?.friend?.profilePic || "/default-avatar.png"
          }
          alt="avatar"
          className="w-9 h-9 rounded-full"
        />
        <h2 className="text-lg font-bold truncate">
          {selectedChat?.friend
            ? `${selectedChat?.friend?.firstName} ${selectedChat?.friend?.lastName}`
            : "Chi tiết cuộc trò chuyện"}
        </h2>
      </div>

      {/* Right (actions sau này, tạm để trống) */}
      <div className="flex items-center gap-2">
        <button className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer">
          <Ellipsis size={30} />
        </button>
      </div>
    </div>
  );
};

export default ChatDetailHeader;
