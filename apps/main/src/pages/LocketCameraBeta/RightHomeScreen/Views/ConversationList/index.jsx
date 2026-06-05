import { ConversationItem } from "./ConversationItem";
import { ConversationSkeleton } from "./ConversationSkeleton";

const ConversationList = ({
  onSelect,
  loading,
  conversations,
  handleLoadMore,
  remainingCount,
  initDisplayCount,
}) => {
  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4">
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
