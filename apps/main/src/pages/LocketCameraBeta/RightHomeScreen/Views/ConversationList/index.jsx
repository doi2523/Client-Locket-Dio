import { ConversationItem } from "./ConversationItem";
import { ConversationSkeleton } from "./ConversationSkeleton";
import { Plus, Users } from "lucide-react";

const ConversationList = ({
  onSelect,
  loading,
  conversations,
  handleLoadMore,
  remainingCount,
  initDisplayCount,
  onCreateGroup,
  hasUserGroup,
}) => {
  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4">
      {/* Nút tạo nhóm */}
      <button
        onClick={onCreateGroup}
        disabled={hasUserGroup}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
          hasUserGroup
            ? "bg-base-300 text-base-content/30 cursor-not-allowed"
            : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98]"
        }`}
        title={
          hasUserGroup
            ? "Bạn đã tạo một nhóm rồi"
            : "Tạo nhóm chat mới"
        }
      >
        {hasUserGroup ? (
          <>
            <Users size={18} />
            Đã tạo nhóm
          </>
        ) : (
          <>
            <Plus size={18} />
            Tạo nhóm mới
          </>
        )}
      </button>

      {loading ? (
        // Hiển thị skeleton khi đang loading
        Array.from({ length: initDisplayCount }).map((_, idx) => (
          <ConversationSkeleton key={idx} />
        ))
      ) : (
        <>
          {/* Danh sách conversations */}
          {conversations.map((msg) => (
            <ConversationItem key={msg.uid} msg={msg} onSelect={onSelect} />
          ))}

          {/* Nút "Xem thêm" */}
          {remainingCount > 0 && (
            <button
              onClick={handleLoadMore}
              className="w-full py-3 mt-4 text-sm font-medium text-primary hover:bg-base-200 rounded-lg transition-colors duration-200"
            >
              Xem thêm {remainingCount} cuộc hội thoại
            </button>
          )}

          {/* Thông báo khi không có conversations */}
          {conversations.length === 0 && (
            <div className="text-center text-base-content/60 py-8">
              Chưa có cuộc hội thoại nào
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConversationList;
