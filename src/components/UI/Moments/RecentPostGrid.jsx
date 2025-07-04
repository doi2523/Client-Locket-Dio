import { MdSlowMotionVideo } from "react-icons/md";

const RecentPostGrid = ({
  recentPosts = [],
  displayedPosts = [],
  loadedItems = [],
  handleOpenMedia,
  handleLoaded,
  handleShowMore,
  hasMore = false,
  visibleCount = 6,
}) => {
  if (recentPosts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-lg text-base-content font-semibold">
        Không có gì ở đây :(
      </div>
    );
  }

  return (
    <>
      {/* <h1>Ảnh/Video đã tải lên</h1> */}
      <div className="grid grid-cols-3 gap-1 md:grid-cols-6 md:gap-2">
        {displayedPosts.map((item) => {
          const isLoaded = loadedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className="aspect-square overflow-hidden cursor-pointer rounded-2xl relative group"
              onClick={() => handleOpenMedia(item)}
            >
              {!isLoaded && (
                <div className="absolute inset-0 skeleton w-full h-full rounded-2xl z-10" />
              )}

              {item.video_url ? (
                <>
                  <img
                    src={item.thumbnail_url}
                    className={`object-cover w-full h-full rounded-2xl transition-all duration-300 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleLoaded(item.id)}
                  />
                  <div className="absolute top-2 right-2 bg-primary/30 rounded-full z-20">
                    <MdSlowMotionVideo className="text-white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.captions?.[0]?.text || "Image"}
                  className={`object-cover w-full h-full rounded-2xl transition-all duration-300 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => handleLoaded(item.id)}
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl z-20" />
            </div>
          );
        })}

        {/* Nút xem thêm */}
        {hasMore && (
          <div
            className="aspect-square overflow-hidden cursor-pointer bg-base-300 rounded-2xl relative group flex items-center justify-center border-2 border-dashed border-base-content/30 hover:bg-base-200 transition-colors"
            onClick={handleShowMore}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">+</div>
              <div className="text-xs text-base-content/70">Xem thêm</div>
              <div className="text-xs text-base-content/50">
                ({Math.min(6, recentPosts.length - visibleCount)})
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecentPostGrid;
