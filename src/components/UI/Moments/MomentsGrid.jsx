import { useEffect, useState } from "react";
import { MdSlowMotionVideo } from "react-icons/md";
import {
  bulkAddMoments,
  clearMoments,
  getAllMoments,
  getMomentsByUser,
} from "../../../cache/momentDB";
import { useApp } from "../../../context/AppContext";
import api from "../../../lib/axios";
import { sortByDateDesc } from "../../../utils/sort/sortByDateDesc";
import LoadingRing from "../Loading/ring";
import { showSuccess } from "../../Toast";
import { RefreshCw, Trash2 } from "lucide-react";

const MomentsGrid = ({ visibleCount: initialVisibleCount = 20 }) => {
  const { post } = useApp();
  const { selectedMoment, setSelectedMoment, selectedFriendUid, setSelectedMomentId } = post;

  const [moments, setMoments] = useState([]);
  const [loadedItems, setLoadedItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount); // 👉 dùng state thay vì prop trực tiếp

  useEffect(() => {
    const fetchMoments = async () => {
      let data = [];

      if (selectedFriendUid) {
        data = await getMomentsByUser(selectedFriendUid);
      } else {
        data = await getAllMoments();
      }

      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoments(sorted);
      setVisibleCount(initialVisibleCount); // reset lại số lượng hiển thị mỗi khi đổi bạn bè
    };

    fetchMoments();
  }, [selectedFriendUid]);

  const handleLoaded = (id) => {
    setLoadedItems((prev) => [...prev, id]);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + initialVisibleCount);
  };
  const [nextPageToken, setNextPageToken] = useState(
    localStorage.getItem("nextPageToken") || null
  );
  const [lastFetchedTime, setLastFetchedTime] = useState(
    localStorage.getItem("lastFetchedTime") || null
  );

  const [loading, setLoading] = useState(false);

  // 🔁 Tách hàm gọi API
  const fetchMomentsFromAPI = async (isInitial = false) => {
    try {
      setLoading(true);
      const res = await api.post("/locket/getMomentV2", {
        pageToken: nextPageToken,
        userUid: selectedFriendUid,
        limit: 20,
      });

      const data = res.data.data || [];
      const newToken = res.data.nextPageToken;

      if (data.length > 0) {
        bulkAddMoments(data);
        const mm = await getAllMoments();

        const sorted = mm.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMoments(sorted);
      }

      setNextPageToken(newToken || null);
      const now = new Date();
      localStorage.setItem("lastFetchedTime", now.toISOString());
      setLastFetchedTime(now.toISOString());
    } catch (err) {
      console.warn("❌ Lỗi khi fetch moments:", err);
    } finally {
      setLoading(false);
    }
  };
  const autoRefreshMoments = async () => {
    setLoading(true);
    try {
      const res = await api.post("/locket/getMomentV2", {
        limit: 20, // lấy cố định 20 moment mới nhất
      });

      const data = res.data.data || [];
      if (data.length > 0) {
        await bulkAddMoments(data); // lưu vào cache
        const mm = await getAllMoments();

        const sorted = mm.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMoments(sorted);
      }
      showSuccess("Lấy bài mới nhất thành công!");

      const now = new Date();
      localStorage.setItem("lastFetchedTime", now.toISOString());
      setLastFetchedTime(now.toISOString());
      return { success: true, fetchedCount: data.length };
    } catch (err) {
      console.error("❌ Lỗi autoRefreshMoments:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // 🔰 Gọi lần đầu
  useEffect(() => {
    const initFetch = async () => {
      const cached = await getAllMoments();

      // Nếu đã có cache rồi thì set vào state
      if (cached.length > 0) {
        const sorted = cached.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setMoments(sorted);
      }

      // ❌ Nếu đã có 200 rồi thì không gọi nữa
      if (
        cached.length >= 200 || // đủ 200 ảnh
        localStorage.getItem("lastFetchedTime") // đã từng gọi API
      ) {
        return;
      }

      // ✅ Nếu chưa đủ 200 hoặc chưa từng fetch thì gọi API
      await fetchMomentsFromAPI(true);
    };

    initFetch();
  }, []);

  const handleClearCache = async () => {
    const confirmClear = window.confirm(
      "Bạn có chắc muốn xoá tất cả moments trong cache?"
    );
    if (!confirmClear) return;

    await clearMoments();
    setMoments([]); // cập nhật lại UI
    localStorage.removeItem("nextPageToken"); // Xoá token nếu muốn reset pagination
    localStorage.removeItem("lastFetchedTime"); // Xoá thời gian nếu cần
    setNextPageToken(null);
    setLastFetchedTime(null); // Cập nhật UI
  };

  if (moments.length === 0) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 md:gap-2 w-full h-full">
        <div
          onClick={fetchMomentsFromAPI}
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

  return (
    <>
      {/* 🧭 Các nút ở đầu */}
      <div className="flex justify-start gap-2 mb-4">
        <button
          onClick={autoRefreshMoments}
          disabled={loading}
          className={`btn btn-primary btn-sm ${loading ? "loading" : ""}`}
        >
          {!loading && <RefreshCw className="w-4 h-4 mr-1" />}
          {loading ? "Đang tải..." : "Lấy bài mới nhất"}
        </button>

        <button onClick={handleClearCache} className="btn btn-error btn-sm">
          <Trash2 className="w-4 h-4 mr-1" />
          Xoá cache
        </button>
      </div>
      {lastFetchedTime && (
        <div className="flex justify-start text-xs text-base-content/50 text-right mb-2">
          🕓 Lần tải gần nhất: {new Date(lastFetchedTime).toLocaleString()}
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 md:grid-cols-6 md:gap-2">
        {moments.slice(0, visibleCount).map((item, index) => {
          const isLoaded = loadedItems.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => {
                setSelectedMoment(index);
                setSelectedMomentId(item.id);
                console.log("🟢 Clicked moment:", {
                  index,
                  id: item.id,
                  caption: item.caption,
                  date: item.date,
                  thumbnail: item.thumbnail_url,
                  isVideo: !!item.video_url,
                });
              }}              
              className="aspect-square overflow-hidden cursor-pointer rounded-2xl relative group"
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
                  alt={item.caption || "Image"}
                  className={`object-cover w-full h-full rounded-2xl transition-all duration-300 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleLoaded(item.id)}
                  loading="lazy"
                />
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-2xl z-20" />
            </div>
          );
        })}

        {visibleCount < moments.length ? (
          // 👉 Nút "Xem thêm" khi vẫn còn trong cache
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
        ) : nextPageToken && moments.length < 200 ? (
          // 👉 Nút "Tải thêm từ server" nếu đã xem hết nhưng còn nextPageToken
          <div
            onClick={() => {
              if (!loading) fetchMomentsFromAPI(false);
            }}
            className={`aspect-square overflow-hidden cursor-pointer bg-base-300 rounded-2xl relative group flex items-center justify-center border-2 border-dashed ${
              loading ? "border-gray-400" : "border-blue-500 hover:bg-blue-100"
            } transition-colors`}
            style={{
              pointerEvents: loading ? "none" : "auto",
              opacity: loading ? 0.5 : 1,
            }}
          >
            <div className="text-center text-blue-500 font-medium">
              {loading ? (
                <LoadingRing />
              ) : (
                <div className="text-sm">🔄 Tải thêm từ server</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default MomentsGrid;
