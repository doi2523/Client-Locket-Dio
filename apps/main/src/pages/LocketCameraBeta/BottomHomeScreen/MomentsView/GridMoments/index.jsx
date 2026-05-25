import { useMomentsStoreV2, useSelectedStore } from "@/stores";
import MomentsGallery from "./MomentsGallery";
import UploadingQueue from "./UploadingQueue";

const GridMoments = ({ selectedAnimate }) => {
  const selectedFriendUid = useSelectedStore((s) => s.selectedFriendUid);
  const selectedKey = selectedFriendUid ?? "all";

  const bucket = useMomentsStoreV2((s) => s.momentsByUser[selectedKey]);
  const moments = bucket?.moments ?? [];
  const loading = bucket?.loading ?? false;
  const hasMore = bucket?.hasMore ?? true;
  const visibleCount = bucket?.visibleCount ?? 0;

  const increaseVisibleCount = useMomentsStoreV2((s) => s.increaseVisibleCount);
  const loadMoreOlder = useMomentsStoreV2((s) => s.loadMoreOlder);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        selectedAnimate
          ? "pointer-events-none select-none opacity-0"
          : "opacity-100"
      }`}
    >
      <UploadingQueue />
      <MomentsGallery
        visibleCount={visibleCount}
        increaseVisibleCount={() => increaseVisibleCount(selectedFriendUid)}
        moments={moments}
        loadMoreOlder={loadMoreOlder}
        hasMore={hasMore}
        loading={loading}
      />
    </div>
  );
};

export default GridMoments;
