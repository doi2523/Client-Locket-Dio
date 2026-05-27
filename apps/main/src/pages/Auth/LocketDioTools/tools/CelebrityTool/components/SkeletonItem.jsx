// --- Skeleton Loading Component ---
const SkeletonItem = () => (
  <div className="animate-pulse flex flex-col gap-2 p-3 rounded-3xl bg-base-200 m-2">
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 bg-gray-300 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="w-32 h-4 bg-gray-300 rounded" />
        <div className="w-20 h-3 bg-gray-300 rounded" />
      </div>
    </div>
  </div>
);

export default SkeletonItem;
