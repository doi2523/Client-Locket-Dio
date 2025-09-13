import React, { useEffect, useState } from "react";
import { getListRequestFriend, rejectMultipleFriendRequests } from "@/services";
import { showError, showInfo, showSuccess } from "@/components/Toast";
import LoadingRing from "@/components/ui/Loading/ring";
import { useFeatureVisible } from "@/hooks/useFeature";

const SESSION_KEY = "invites_session";

export default function DeleteFriendsTool() {
  const actionDelete = !useFeatureVisible("invite_cleanup_tool");
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({
    current: 0,
    total: 0,
    isEstimating: true,
  });

  useEffect(() => {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try {
        setInvites(JSON.parse(cached)?.invites || []);
      } catch (err) {
        console.error("Failed to parse session data", err);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ invites }));
  }, [invites]);

  const handleFetchAllInvites = async () => {
    setLoading(true);
    setInvites([]);
    setFetchProgress({ current: 0, total: 0, isEstimating: true });

    try {
      let allInvites = [];
      let nextPageToken = null;
      let pageCount = 0;

      do {
        pageCount++;
        const res = await getListRequestFriend(nextPageToken, 80);
        if (res.message) {
          showError(res.message);
          break;
        }
        const newInvites = res?.friends || [];
        allInvites = [...allInvites, ...newInvites];
        nextPageToken = res?.nextPageToken;

        setFetchProgress({
          current: allInvites.length,
          total: nextPageToken ? allInvites.length + 50 : allInvites.length,
          isEstimating: !!nextPageToken,
        });

        setInvites([...allInvites]);

        if (nextPageToken) await new Promise(r => setTimeout(r, 500));
      } while (nextPageToken);

      setFetchProgress({
        current: allInvites.length,
        total: allInvites.length,
        isEstimating: false,
      });

      showSuccess(`✅ Đã tải xong ${allInvites.length} lời mời! (${pageCount} trang)`);
    } catch (error) {
      showError("❌ Lỗi khi tải lời mời: " + error.message);
    }

    setLoading(false);
  };

  const handleDeleteBatch = async () => {
    const batch = invites.slice(0, 200);
    if (batch.length === 0) return showInfo("📭 Không còn lời mời để xoá.");

    setDeleting(true);
    try {
      const uidList = batch.map((invite) => invite.uid);
      const data = await rejectMultipleFriendRequests(uidList);
      const successCount = data?.successCount ?? batch.length;

      showSuccess(`🧹 Đã xoá ${successCount}/${batch.length} lời mời.`);

      setInvites((prev) => prev.filter((invite) => !uidList.includes(invite.uid)));
    } catch (error) {
      showError("❌ Xoá lời mời thất bại: " + error.message);
    }
    setDeleting(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Xoá lời mời không mong muốn{" "}
        <span className="badge badge-sm badge-secondary">Hot</span>
      </h2>
      <p>🎯 Công cụ này giúp bạn xoá lời mời spam. Hành động này không thể hoàn tác.</p>
      <p className="text-sm">
        Giới hạn xoá tối đa: <span className="font-semibold underline">200</span> lời mời.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <button
          onClick={handleFetchAllInvites}
          className="btn btn-primary w-full"
          disabled={loading || actionDelete}
        >
          {loading && <LoadingRing size={20} stroke={2} color="white" />}
          {loading ? "Đang tải..." : "📥 Lấy tất cả lời mời"}
        </button>

        {loading && fetchProgress.current > 0 && (
          <div className="bg-base-100 border rounded-lg p-4">
            <div className="text-sm mb-2">
              Đang tải: <strong>{fetchProgress.current}</strong>
              {fetchProgress.isEstimating ? "+" : ""} lời mời
              {!fetchProgress.isEstimating && ` (hoàn thành)`}
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: fetchProgress.isEstimating
                    ? "70%"
                    : `${(fetchProgress.current / fetchProgress.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {invites.length > 0 && (
          <>
            <div className="text-sm">
              Đã tìm thấy <strong>{invites.length}</strong> lời mời.
            </div>
            <ul className="bg-base-100 border rounded-lg p-4 max-h-48 overflow-auto text-sm space-y-2">
              {invites.map((invite, idx) => (
                <li key={idx}>
                  👤 <code>{invite.uid}</code>{" "}
                  <span className="text-xs opacity-60">
                    ({new Date(invite.date).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleDeleteBatch}
              className="btn btn-error w-full"
              disabled={deleting}
            >
              {deleting ? "Đang xoá..." : `🗑️ Xoá 200 lời mời`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
