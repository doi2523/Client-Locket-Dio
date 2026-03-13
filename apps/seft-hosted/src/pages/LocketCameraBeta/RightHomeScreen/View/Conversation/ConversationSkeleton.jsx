// ================= Skeleton for conversation =================
export const ConversationSkeleton = () => {
  return (
    <div className="relative w-full flex items-center gap-3 p-3 rounded-3xl shadow-sm">
      {/* Avatar */}
      <div className="w-15 h-15 rounded-full bg-gray-300 animate-pulse" />

      {/* Nội dung */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};
