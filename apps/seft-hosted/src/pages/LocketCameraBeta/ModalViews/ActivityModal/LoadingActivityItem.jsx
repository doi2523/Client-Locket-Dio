const LoadingActivityItem = () => (
  <li className="flex items-center gap-3 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-base-300"></div>
    <div className="flex flex-col gap-1 flex-1">
      <div className="h-4 bg-base-300 rounded w-24"></div>
      <div className="h-3 bg-base-300 rounded w-16"></div>
    </div>
  </li>
);

export default LoadingActivityItem;
