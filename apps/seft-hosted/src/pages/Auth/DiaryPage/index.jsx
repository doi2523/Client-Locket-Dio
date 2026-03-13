import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useAuthStore, useFriendStoreV2 } from "@/stores";
import { getRemovedFriends } from "@/cache/diaryDB";
import { fetchUserById } from "@/services";

const NEW_DAYS = 7 * 24 * 60 * 60 * 1000;

export default function DiaryPage() {
  const { user } = useAuthStore();
  const { friendDetailsMap, friendRelationsMap } = useFriendStoreV2();

  const [removedUsers, setRemovedUsers] = useState([]);
  const [newFriends, setNewFriends] = useState([]);

  // -------------------------
  // 🆕 FRIENDS IN LAST 7 DAYS
  // -------------------------
  useEffect(() => {
    const now = Date.now();

    const list = Object.entries(friendRelationsMap)
      .filter(([_, meta]) => now - meta.createdAt <= NEW_DAYS)
      .map(([uid]) => friendDetailsMap[uid])
      .filter(Boolean);

    setNewFriends(list);
  }, [friendRelationsMap, friendDetailsMap]);

  // -------------------------
  // ❌ REMOVED FRIENDS
  // -------------------------
  useEffect(() => {
    const loadRemoved = async () => {
      const removedIds = await getRemovedFriends(); // [{ uid, removedAt }]
      if (!removedIds?.length) return;

      const users = await Promise.all(
        removedIds.map((f) => fetchUserById(f.uid).catch(() => null))
      );

      setRemovedUsers(users.filter(Boolean));
    };

    loadRemoved();
  }, []);

  return (
    <div className="flex flex-col items-center h-[84vh] w-full p-6 bg-base-200 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarClock size={28} />
        <h1 className="text-3xl font-bold">
          Nhật ký của {user?.displayName || "bạn"}
        </h1>
      </div>

      {/* ================= NEW FRIENDS ================= */}
      <section className="w-full max-w-xl mb-6">
        <h2 className="text-lg font-semibold mb-3">🆕 Bạn bè mới (7 ngày)</h2>

        {newFriends.length === 0 ? (
          <p className="text-sm text-gray-500">Không có bạn mới</p>
        ) : (
          <ul className="space-y-2">
            {newFriends.map((f) => (
              <li
                key={f.uid}
                className="flex items-center gap-3 p-3 bg-base-100 rounded-xl shadow"
              >
                <img src={f.profilePic} className="w-10 h-10 rounded-full" />
                <span className="font-semibold">
                  {f.firstName} {f.lastName}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ================= REMOVED FRIENDS ================= */}
      <section className="w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-3">❌ Bạn bè đã xoá</h2>

        {removedUsers.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa xoá ai</p>
        ) : (
          <ul className="space-y-3">
            {removedUsers.map((f) => (
              <li
                key={f.uid}
                className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 
                 border border-base-300 transition"
              >
                {/* Avatar */}
                <img
                  src={f.profile_picture_url || "/default-avatar.png"}
                  alt={f.username}
                  className="w-11 h-11 rounded-full object-cover"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base truncate">
                    {f.first_name} {f.last_name}
                  </p>
                  <p className="text-sm text-base-content/60 truncate">
                    @{f.username}
                  </p>
                </div>

                {/* Tag trạng thái */}
                <span className="text-xs px-2 py-1 rounded-full bg-error/10 text-error font-medium">
                  Đã xoá
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
