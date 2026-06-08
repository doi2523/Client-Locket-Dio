import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  X,
  Plus,
  UserMinus,
  Users,
  Bell,
  BellOff,
  Pencil,
  Check,
  Search,
  LogOut,
} from "lucide-react";
import {
  useFriendStoreV3,
  useGroupChatStore,
  useAuthStore,
  useUserInfoStore,
} from "@/stores";
import {
  addGroupMember,
  removeGroupMember,
  updateGroupName,
  toggleGroupMute,
} from "@/services";
import { SonnerInfo } from "@/components/ui/SonnerToast";
import AddMemberModal from "./AddMemberModal";

const DetailGroupPoup = ({ open, onClose, group, loading = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showModal]);

  useEffect(() => {
    if (open) {
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [open]);

  const myUser = useAuthStore((s) => s.user);
  const myUserId = myUser?.uid;
  const friendDetailsMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const friendList = useFriendStoreV3((s) => s.friendList);
  const upsertGroup = useGroupChatStore((s) => s.upsertGroup);
  const removeGroups = useGroupChatStore((s) => s.removeGroups);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(group?.name || "");
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);
  const userInfoMap = useUserInfoStore((s) => s.userInfoMap);
  const ensureUsers = useUserInfoStore((s) => s.ensureUsers);

  const groupMembers = group?.users || [];
  const memberIds = new Set(groupMembers.map((u) => u.user_id));

  useEffect(() => {
    const unknownIds = groupMembers
      .filter(
        (u) =>
          u.user_id !== myUserId &&
          !friendDetailsMap[u.user_id] &&
          !userInfoMap[u.user_id],
      )
      .map((u) => u.user_id);

    if (unknownIds.length > 0) ensureUsers(unknownIds);
  }, [group?.id]);

  const availableFriends = useMemo(() => {
    return friendList
      .filter((uid) => !memberIds.has(uid))
      .map((uid) => friendDetailsMap[uid])
      .filter(Boolean)
      .filter((f) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          (f.firstName || "").toLowerCase().includes(q) ||
          (f.lastName || "").toLowerCase().includes(q) ||
          (f.username || "").toLowerCase().includes(q)
        );
      });
  }, [friendList, memberIds, friendDetailsMap, searchQuery]);

  const handleRename = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === (group?.name || "")) {
      setEditingName(false);
      return;
    }
    setLoadingAction("rename");
    try {
      const updated = await updateGroupName({
        groupId: group.id,
        name: trimmed,
      });
      if (updated) upsertGroup(updated);
    } catch (err) {
      console.error("Rename failed:", err);
    }
    setLoadingAction(null);
    setEditingName(false);
  };

  const handleToggleMute = async () => {
    setLoadingAction("mute");
    try {
      // await toggleGroupMute({ groupId: group.id, muted: !group.muted });
      // upsertGroup({ id: group.id, muted: !group.muted });
      SonnerInfo("Tính năng đang được phát triển");
    } catch (err) {
      console.error("Toggle mute failed:", err);
    }
    setLoadingAction(null);
  };

  const handleAddMember = async (userId) => {
    setLoadingAction(`add_${userId}`);
    try {
      // const updated = await addGroupMember({
      //   groupId: group.id,
      //   userId,
      // });
      // if (updated) upsertGroup(updated);
      SonnerInfo("Tính năng đang được phát triển");
    } catch (err) {
      console.error("Add member failed:", err);
    }
    setLoadingAction(null);
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Xoá thành viên này khỏi nhóm?")) return;
    setLoadingAction(`remove_${userId}`);
    try {
      const updated = await removeGroupMember({
        groupId: group.id,
        userId,
      });
      if (updated) upsertGroup(updated);
    } catch (err) {
      console.error("Remove member failed:", err);
    }
    setLoadingAction(null);
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Bạn có chắc muốn rời nhóm?")) return;
    setLoadingAction("leave");
    try {
      await removeGroupMember({
        groupId: group.id,
        userId: myUserId,
      });
      removeGroups([group.id]);
      onLeaveGroup?.();
    } catch (err) {
      console.error("Leave group failed:", err);
    }
    setLoadingAction(null);
  };

  const getUserInfo = (userId) => {
    if (userId === myUserId) {
      return {
        firstName: myUser?.firstName || myUser?.first_name || "",
        profilePic: myUser?.profilePic || myUser?.profile_picture_url || null,
      };
    }
    const friend = friendDetailsMap[userId];
    if (friend?.firstName) return friend;
    const cached = userInfoMap[userId];
    if (cached?.firstName) return cached;
    return null;
  };

  const getFriendName = (userId) => {
    const info = getUserInfo(userId);
    if (info?.firstName) return info.firstName;
    return userId?.slice(0, 8) || "Unknown";
  };

  const getFriendAvatar = (userId) => {
    return getUserInfo(userId)?.profilePic || null;
  };

  if (!showModal) return null;

  const baseBtn =
    "btn btn-lg text-base font-semibold rounded-3xl w-full sm:w-auto sm:min-w-[140px] px-6 flex items-center justify-center gap-2";

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62] ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={!loading ? onClose : undefined}
    >
      <div
        className={`fixed h-[90%] border-t border-base-300 bottom-0 left-0 w-full p-4 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto space-y-5">
          <div className="flex flex-col items-center gap-3">
            {group?.image_url ? (
              <img
                src={group.image_url}
                alt=""
                className="w-20 h-20 rounded-full object-cover border-2 border-base-300"
              />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-primary/10 border-2 border-primary/20">
                <Users className="w-10 h-10 text-primary" />
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    className="input input-bordered input-sm w-48 text-center"
                    autoFocus
                  />
                  <button
                    onClick={handleRename}
                    className="btn btn-ghost btn-sm btn-square"
                    disabled={loadingAction === "rename"}
                  >
                    {loadingAction === "rename" ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Check size={18} />
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-lg font-semibold">
                    {group?.name || "Nhóm chat"}
                  </span>
                  <button
                    onClick={() => {
                      // setNameInput(group?.name || "");
                      // setEditingName(true);
                      SonnerInfo("Tính năng đang được phát triển");
                    }}
                    className="btn btn-ghost btn-xs btn-square"
                  >
                    <Pencil size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-base-200 rounded-xl">
            <div className="flex items-center gap-3">
              {group?.muted ? (
                <BellOff size={20} className="text-base-content/60" />
              ) : (
                <Bell size={20} />
              )}
              <span className="font-medium">Thông báo</span>
            </div>
            <button
              onClick={handleToggleMute}
              className={`btn btn-sm min-w-16 ${
                group?.muted ? "btn-ghost" : "btn-primary"
              } rounded-full`}
              disabled={loadingAction === "mute"}
            >
              {loadingAction === "mute" ? (
                <span className="loading loading-spinner loading-xs" />
              ) : group?.muted ? (
                "Bật"
              ) : (
                "Tắt"
              )}
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-base-content/80">
                Thành viên ({groupMembers.length})
              </h4>
              <button
                onClick={() => setShowAddMember(true)}
                className="btn btn-ghost btn-sm rounded-full gap-1"
              >
                <Plus size={16} />
                Thêm
              </button>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {groupMembers.map(({ user_id }) => {
                const isSelf = user_id === myUserId;
                const avatar = getFriendAvatar(user_id);
                const name = getFriendName(user_id);
                const isLoading = loadingAction === `remove_${user_id}`;

                return (
                  <div
                    key={user_id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{name}</p>
                        {isSelf && (
                          <p className="text-[10px] text-base-content/40">
                            Bạn
                          </p>
                        )}
                      </div>
                    </div>
                    {!isSelf && (
                      <button
                        onClick={() => {
                          SonnerInfo("Tính năng đang được phát triển");
                          // handleRemoveMember(user_id);
                        }}
                        className="btn btn-ghost btn-xs text-error gap-1"
                        disabled={!!isLoading}
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <UserMinus size={14} />
                        )}
                        Xoá
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <AddMemberModal
            open={showAddMember}
            onClose={() => setShowAddMember(false)}
            availableFriends={availableFriends}
            onAddMember={handleAddMember}
            loadingAction={loadingAction}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DetailGroupPoup;
