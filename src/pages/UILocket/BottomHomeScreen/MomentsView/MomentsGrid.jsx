import { useEffect, useState, useCallback, useRef } from "react";
import { MdSlowMotionVideo } from "react-icons/md";
import { RefreshCw, Trash2 } from "lucide-react";
import { useMoments } from "@/hooks/useMoments";
import { showSuccess } from "@/components/Toast";
import { useApp } from "@/context/AppContext";
import { MAX_MOMENTS_DISPLAY_LIMIT } from "@/constants";
import LoadingRing from "@/components/ui/Loading/ring";

const MomentsGrid = ({ visibleCount: initialVisibleCount }) => {
  const { post } = useApp();
  const {
    selectedMoment,
    setSelectedMoment,
    selectedFriendUid,
    setSelectedMomentId,
  } = post;

  const {
    moments,
    loading,
    fetchFromAPI,
    refreshLatest,
    clearCache,
    lastFetchedTime,
    nextPageToken,
  } = useMoments(selectedFriendUid);

  const [loadedItems, setLoadedItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  // Ref để theo dõi phần tử cuối cùng
  const lastElementRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    setVisibleCount(initialVisibleCount); // reset mỗi khi đổi bạn bè
  }, [selectedFriendUid]);

  // Hàm tự động tải thêm từ API
  const autoLoadMore = useCallback(async () => {
    if (
      loading ||
      isAutoLoading ||
      !nextPageToken ||
      moments.length >= MAX_MOMENTS_DISPLAY_LIMIT
    ) {
      return;
    }

    setIsAutoLoading(true);
    try {
      await fetchFromAPI();
    } catch (error) {
      console.error("Auto load failed:", error);
    } finally {
      setIsAutoLoading(false);
    }
  }, [loading, isAutoLoading, nextPageToken, moments.length, fetchFromAPI]);

  // Intersection Observer để theo dõi khi cuộn gần cuối
  useEffect(() => {
    if (!lastElementRef.current) return;

    // Cleanup observer cũ
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting) {
          // Khi phần tử gần cuối xuất hiện trong viewport
          if (visibleCount < moments.length) {
            // Nếu còn items đã tải để hiển thị, tăng visibleCount
            setVisibleCount((prev) =>
              Math.min(prev + initialVisibleCount, moments.length)
            );
          } else if (
            nextPageToken &&
            moments.length < MAX_MOMENTS_DISPLAY_LIMIT
          ) {
            // Nếu đã hiển thị hết và còn có thể tải thêm từ API
            autoLoadMore();
          }
        }
      },
      {
        // Trigger khi phần tử cách viewport 200px
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observerRef.current.observe(lastElementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    visibleCount,
    moments.length,
    nextPageToken,
    autoLoadMore,
    initialVisibleCount,
  ]);

  // Cleanup observer khi unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleLoaded = (id) => {
    setLoadedItems((prev) => [...prev, id]);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + initialVisibleCount);
  };

  if (moments.length === 0) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 md:gap-2 w-full h-full">
        <div
          onClick={fetchFromAPI}
          className="aspect-square bg-base-300 rounded-2xl border-2 border-dashed border-base-content/30 flex flex-col justify-center items-center cursor-pointer hover:bg-base-200 transition-colors"
        >
          <div className="text-2xl mb-1">+</div>
          <div className="text-xs font-medium text-base-content/70">
            Bắt đầu xem
          </div>
          <div className="text-xs text-base-content/50">
            Nhấn để tải dữ liệu
          </div>
        </div>
      </div>
    );
  }

  const visibleMoments = moments.slice(0, visibleCount);
  const hasMoreToShow = visibleCount < moments.length;
  const canLoadMoreFromAPI =
    nextPageToken && moments.length < MAX_MOMENTS_DISPLAY_LIMIT;

  return (
    <>
      <div className="flex justify-start gap-2 mb-4 px-4">
        <button
          onClick={async () => {
            const result = await refreshLatest();
            if (result?.success) showSuccess("Lấy bài mới nhất thành công!");
          }}
          disabled={loading}
          className={`btn btn-primary btn-sm ${loading ? "loading" : ""}`}
        >
          {!loading && <RefreshCw className="w-4 h-4 mr-1" />}
          {loading ? "Đang tải..." : "Lấy bài mới nhất"}
        </button>

        <button onClick={clearCache} className="btn btn-error btn-sm">
          <Trash2 className="w-4 h-4 mr-1" />
          Xoá cache
        </button>
      </div>

      {lastFetchedTime && (
        <div className="text-xs text-base-content/50 mb-2 px-4">
          🕓 Lần tải gần nhất: {new Date(lastFetchedTime).toLocaleString()}
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 md:grid-cols-6 md:gap-2">
        {visibleMoments.map((item, index) => {
          const isLoaded = loadedItems.includes(item.id);
          const isLastItem = index === visibleMoments.length - 1;
          const shouldObserve =
            isLastItem && (hasMoreToShow || canLoadMoreFromAPI);

          return (
            <div
              key={item.id}
              ref={shouldObserve ? lastElementRef : null}
              onClick={() => {
                setSelectedMoment(index);
                setSelectedMomentId(item.id);
              }}
              className="aspect-square overflow-hidden cursor-pointer rounded-2xl relative group"
            >
              {!isLoaded && (
                <div className="absolute inset-0 skeleton w-full h-full rounded-2xl z-10" />
              )}

              <img
                src={item.thumbnail_url || item.image_url || item.thumbnailUrl}
                alt={item.caption || "Image"}
                className={`object-cover w-full h-full rounded-2xl transition-all duration-300 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleLoaded(item.id)}
                loading="lazy"
              />

              {item.video_url ||
                (item.videoUrl && (
                  <div className="absolute top-2 right-2 bg-primary/30 rounded-full z-20">
                    <MdSlowMotionVideo className="text-white" />
                  </div>
                ))}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl z-20" />
            </div>
          );
        })}

        {/* Loading indicator khi đang tự động tải */}
        {(isAutoLoading || loading) && canLoadMoreFromAPI && (
          <div className="aspect-square overflow-hidden bg-base-300 rounded-2xl relative group flex items-center justify-center border-2 border-dashed border-gray-400 opacity-50">
            <div className="text-center">
              <LoadingRing />
              <div className="text-xs text-base-content/70 mt-2">
                Đang tải...
              </div>
            </div>
          </div>
        )}

        {/* Manual load more button (backup) */}
        {hasMoreToShow && !isAutoLoading && (
          <div
            onClick={handleLoadMore}
            className="aspect-square overflow-hidden cursor-pointer bg-base-300 rounded-2xl relative group flex items-center justify-center border-2 border-dashed border-base-content/30 hover:bg-base-200 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">+</div>
              <div className="text-xs text-base-content/70">Xem thêm</div>
              <div className="text-xs text-base-content/50">
                ({moments.length - visibleCount})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 text-xs text-base-content/50 space-y-1">
          <div>
            Hiển thị: {visibleCount}/{moments.length}
          </div>
          <div>Giới hạn tối đa: {MAX_MOMENTS_DISPLAY_LIMIT}</div>
          <div>Có thể tải thêm: {canLoadMoreFromAPI ? "Có" : "Không"}</div>
          <div>Đang auto load: {isAutoLoading ? "Có" : "Không"}</div>
          {moments.length >= MAX_MOMENTS_DISPLAY_LIMIT && (
            <div className="text-warning">⚠️ Đã đạt giới hạn tối đa</div>
          )}
        </div>
      )}
    </>
  );
};

export default MomentsGrid;
