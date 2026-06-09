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
  UserRoundPlus,
  Flag,
  MoreVertical,
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
import { SonnerInfo, SonnerPromise } from "@/components/ui/SonnerToast";
import AddMemberModal from "./AddMemberModal";
import SearchInput from "@/components/ui/Input/SearchInput";
import EditGroupPoup from "./EditGroupModal";

const DetailGroupPoup = ({ open, onClose, group, loading = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
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

  const [showEditGroup, setShowEditGroup] = useState(false);
  const [editName, setEditName] = useState(group?.name || "");
  const [editAvatar, setEditAvatar] = useState(group?.image_url || null);

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
  const handleReportUser = (userId) => {
    SonnerInfo("Đã gửi báo cáo người dùng");
    console.log("report user:", userId);
  };

  const handleToggleMute = () => {
    setLoadingAction("mute");

    const promise = toggleGroupMute({
      groupId: group.id,
      muted: !group.muted,
    });

    SonnerPromise(promise, {
      loading: "Đang cập nhật...",
      success: () => {
        upsertGroup({ id: group.id, muted: !group.muted });
        return group.muted ? "Đã bật thông báo 🔔" : "Đã tắt thông báo 🔕";
      },
      error: "Cập nhật thất bại!",
    });

    promise.finally(() => setLoadingAction(null));
  };

  const handleAddMember = (userId) => {
    const promise = addGroupMember({
      groupId: group.id,
      userId,
    });

    SonnerPromise(promise, {
      loading: "Đang thêm thành viên...",
      success: (res) => {
        if (res) upsertGroup(res);
        return "Thêm thành viên thành công 🎉";
      },
      error: "Thêm thành viên thất bại!",
    });

    setLoadingAction(`add_${userId}`);

    promise.finally(() => {
      setLoadingAction(null);
    });
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Xoá thành viên này khỏi nhóm?")) return;
    setLoadingAction(`remove_${userId}`);
    try {
      SonnerInfo("Tính năng đang được phát triển");
      // const updated = await removeGroupMember({
      //   groupId: group.id,
      //   userId,
      // });
      // if (updated) upsertGroup(updated);
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

    const first = info?.firstName || "";
    const last = info?.lastName || "";

    const fullName = `${first} ${last}`.trim();

    if (fullName) return fullName;

    return userId?.slice(0, 8) || "Unknown";
  };

  const getFriendAvatar = (userId) => {
    return getUserInfo(userId)?.profilePic || null;
  };

  if (!showModal) return null;

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
        <div className="shrink-0 space-y-4 pb-3 border-b border-base-300">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center gap-3">
            {group?.image_url ? (
              <img
                src={group.image_url}
                className="w-20 h-20 rounded-full object-cover border-2 border-base-300"
              />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-primary/10 border-2 border-primary/20">
                <Users className="w-10 h-10 text-primary" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {group?.name || "Nhóm chat"}
              </span>

              <button
                onClick={() => setShowEditGroup(true)}
                className="btn btn-ghost btn-xs"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>

          <div className="p-3 bg-base-200 rounded-xl space-y-2">
            {/* Toggle mute */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                {group?.muted ? (
                  <BellOff size={18} className="text-base-content/60" />
                ) : (
                  <Bell size={18} />
                )}
                <span className="font-medium">Tắt thông báo</span>
              </div>

              <input
                type="checkbox"
                checked={group?.muted}
                onChange={handleToggleMute}
                className="toggle toggle-secondary"
              />
            </div>

            <div className="divider my-0 opacity-30" />

            {/* Leave group */}
            <button
              onClick={handleLeaveGroup}
              className="flex items-center gap-3 w-full py-2 hover:bg-error/10 rounded-lg transition-colors"
            >
              <LogOut size={18} className="text-error" />
              <span className="font-medium text-error">Rời nhóm</span>
            </button>
          </div>

          {/* Search input */}
          <SearchInput
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            isFocused={false}
            setIsFocused={() => {}}
            placeholder="Tìm kiếm thành viên..."
          />

          {/* Member header */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-base-content/80">
              Thành viên ({groupMembers.length})
            </h4>

            <button
              onClick={() => setShowAddMember(true)}
              className="btn btn-secondary btn-sm rounded-full gap-1"
            >
              <UserRoundPlus size={16} />
              Thêm thành viên
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-5 pt-4">
          {/* Member list */}
          <div className="space-y-1">
            {/* SELF INFO */}
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <img
                  src={myUser.profilePicture}
                  className="w-9 h-9 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "./images/default_profile.png";
                  }}
                />

                <div>
                  <p className="text-sm font-medium">{myUser?.displayName}</p>
                  <p className="text-[10px] text-base-content/40">Bạn</p>
                </div>
              </div>
            </div>
            {groupMembers
              .filter((m) => m.user_id !== myUserId)
              .filter((m) => {
                if (!searchQuery) return true;
                const name = getFriendName(m.user_id).toLowerCase();
                return name.includes(searchQuery.toLowerCase());
              })
              .map(({ user_id }) => {
                const isSelf = user_id === myUserId;
                const avatar = getFriendAvatar(user_id);
                const name = getFriendName(user_id);
                const isOpen = openMenuUserId === user_id;

                return (
                  <div
                    key={user_id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition-colors relative"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3 min-w-0">
                      {avatar ? (
                        <img src={avatar} className="w-9 h-9 rounded-full" />
                      ) : (
                        <img
                          src="./images/default_profile.png"
                          className="w-9 h-9 rounded-full"
                        />
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

                    {/* RIGHT - 3 DOT MENU */}
                    {!isSelf && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenuUserId(isOpen ? null : user_id)
                          }
                          className="btn btn-ghost btn-xs"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* DROPDOWN */}
                        {isOpen && (
                          <div className="absolute right-0 top-8 w-40 bg-base-100 shadow-lg rounded-xl border border-base-300 z-50 overflow-hidden">
                            {/* REMOVE */}
                            <button
                              onClick={() => {
                                handleRemoveMember(user_id);
                                setOpenMenuUserId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-base-200 text-error"
                            >
                              <UserMinus size={14} />
                              Xoá khỏi nhóm
                            </button>

                            {/* REPORT */}
                            <button
                              onClick={() => {
                                handleReportUser(user_id);
                                setOpenMenuUserId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-base-200 text-warning"
                            >
                              <Flag size={14} />
                              Báo cáo
                            </button>
                          </div>
                        )}
                      </div>
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
        <EditGroupPoup
          open={showEditGroup}
          onClose={() => setShowEditGroup(false)}
          group={group}
          onUpdated={(updated) => {
            upsertGroup(updated);
          }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default DetailGroupPoup;
