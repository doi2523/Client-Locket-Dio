import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { useAuthStore, useFriendObjects, useFriendStoreV3 } from "@/stores";
import { cleanupRemovedFriends } from "@/cache/diaryDB";
import { fetchUserById } from "@/services";

const NEW_DAYS = 7 * 24 * 60 * 60 * 1000;

export default function DiaryPage() {
  const user = useAuthStore((state) => state.user);
  const friendRelationsMap = useFriendStoreV3((state) => state.friendRelationsMap);
  const friendObjects = useFriendObjects();

  const [removedUsers, setRemovedUsers] = useState([]);
  const [newFriends, setNewFriends] = useState([]);

  // -------------------------
  // 🆕 FRIENDS IN LAST 7 DAYS
  // -------------------------
  useEffect(() => {
    const now = Date.now();

    const list = friendObjects.filter(
      (friend) => now - (friend?.relation?.createdAt || 0) <= NEW_DAYS,
    );

    setNewFriends(list);
  }, [friendObjects]);

  // -------------------------
  // ❌ REMOVED FRIENDS
  // -------------------------
  useEffect(() => {
    const loadRemoved = async () => {
      const removedRecords = await cleanupRemovedFriends(
        Object.keys(friendRelationsMap),
      );

      if (!removedRecords.length) {
        setRemovedUsers([]);
        return;
      }

      const users = await Promise.all(
        removedRecords.map(async (record) => {
          try {
            const user = await fetchUserById(record.uid);

            return {
              ...user,
              removedAt: record.removedAt,
            };
          } catch {
            return null;
          }
        }),
      );

      setRemovedUsers(users.filter(Boolean));
    };

    loadRemoved();
  }, [friendRelationsMap]);

  return (
    <div className="flex flex-col items-center h-[84vh] w-full p-6 bg-base-200 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarClock size={28} />
        <h1 className="text-3xl font-bold">
          Nhật ký của {user?.displayName || "bạn"}
        </h1>
      </div>

      <section className="w-full max-w-xl mb-6">
        <h2 className="text-lg font-semibold mb-3">🆕 Bạn bè mới (7 ngày)</h2>

        {newFriends.length === 0 ? (
          <p className="text-sm text-gray-500">Không có bạn mới</p>
        ) : (
          <ul className="space-y-2">
            {newFriends.map((friend) => (
              <NewFriendItem key={friend.uid} friend={friend} />
            ))}
          </ul>
        )}
      </section>

      <section className="w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-3">❌ Bạn bè đã xoá</h2>

        {removedUsers.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa xoá ai</p>
        ) : (
          <ul className="space-y-3">
            {removedUsers.map((friend) => (
              <RemovedFriendItem key={friend.uid} friend={friend} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const NewFriendItem = ({ friend }) => {
  const avatar = friend?.profilePic || "./images/default_profile.png";
  const fullName =
    `${friend?.firstName || ""} ${friend?.lastName || ""}`.trim() ||
    "Người dùng không xác định";

  return (
    <li className="flex items-center gap-3 p-3 bg-base-100 rounded-xl shadow">
      <img
        src={avatar}
        alt={friend?.username || "avatar"}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{fullName}</p>

        <p className="text-sm text-base-content/60 truncate">
          @{friend?.username || "unknown"}
        </p>

        <p className="text-xs text-base-content/60">
          {friend?.relation?.createdAt
            ? `Thêm vào: ${new Date(friend.relation.createdAt).toLocaleString("vi-VN")}`
            : "Thêm vào: Không rõ"}
        </p>
      </div>
    </li>
  );
};

const RemovedFriendItem = ({ friend }) => {
  const avatar = friend?.profile_picture_url || "./images/default_profile.png";

  const fullName =
    `${friend?.first_name || ""} ${friend?.last_name || ""}`.trim() ||
    "Người dùng không xác định";

  return (
    <li className="flex items-center gap-4 p-4 rounded-2xl bg-base-100 border border-base-300">
      <img
        src={avatar}
        alt={friend?.username || "avatar"}
        className="w-11 h-11 rounded-full object-cover"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{fullName}</p>

        <p className="text-sm text-base-content/60 truncate">
          @{friend?.username || "unknown"}
        </p>

        <p className="text-xs text-base-content/60">
          {friend?.removedAt
            ? `Phát hiện lúc: ${new Date(friend.removedAt).toLocaleString(
                "vi-VN",
              )}`
            : "Không rõ thời gian"}
        </p>
      </div>

      <span className="text-xs px-2 py-1 rounded-full bg-error/10 text-error font-medium">
        Đã xoá
      </span>
    </li>
  );
};
