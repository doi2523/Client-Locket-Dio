import React, { useState } from "react";
import { ChevronLeft, Ellipsis, Users } from "lucide-react";
import { useFriendStoreV3, useGroupChatStore, useUserInfoStore } from "@/stores";
import DetailGroupPoup from "../../Modal/DetailGroupModal";

const HeaderGroupChatDetail = ({ selectedChat, onBack }) => {
  const friendMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const userInfoMap = useUserInfoStore((s) => s.userInfoMap);
  const groupFromStore = useGroupChatStore((s) =>
    s.groups.find((g) => g.id === selectedChat?.uid),
  );
  const [showInfoModal, setShowInfoModal] = useState(false);

  const group = groupFromStore || selectedChat?.group;
  const groupMembers = (group?.users || []).map((u) =>
    friendMap?.[u.user_id] || userInfoMap?.[u.user_id] || { user_id: u.user_id },
  );

  const getDisplayName = () => {
    if (group?.name) return group.name;
    if (group?.emoji) return group.emoji;

    const names = groupMembers
      .map((f) => f?.firstName)
      .filter(Boolean)
      .slice(0, 3);

    if (names.length) return names.join(", ");
    return "Nhóm chat";
  };

  const displayName = getDisplayName();

  return (
    <>
      <div className="flex items-center justify-between shadow-lg px-4 py-2 bg-base-100 text-base-content border-b border-base-200">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer"
          >
            <ChevronLeft size={30} />
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center flex-row gap-3 text-center min-w-0">
          {group?.image_url ? (
            <img
              src={group.image_url}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-base-300"
            />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
              {group?.emoji ? (
                <span className="text-lg">{group.emoji}</span>
              ) : groupMembers[0]?.profilePic ? (
                <img
                  src={groupMembers[0].profilePic}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <Users className="w-5 h-5 text-primary" />
              )}
            </div>
          )}

          <div className="flex flex-col text-left min-w-0">
            <h2 className="text-base font-bold truncate max-w-[180px]">
              {displayName}
            </h2>
            <span className="text-[10px] text-base-content/60 font-semibold truncate">
              {groupMembers.length > 0
                ? `${groupMembers.length} thành viên`
                : "Trò chuyện nhóm"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfoModal(true)}
            className="btn p-1 border-0 rounded-full hover:bg-base-200 transition cursor-pointer"
          >
            <Ellipsis size={30} />
          </button>
        </div>
      </div>

      {/* {showInfoModal && (
        <GroupInfoModal
          group={group}
          onClose={() => setShowInfoModal(false)}
          onLeaveGroup={() => {
            setShowInfoModal(false);
            onBack();
          }}
        />
      )} */}
      <DetailGroupPoup
        open={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        group={group}
        title={displayName}
        onConfirm={() => {
          setShowInfoModal(false);
          onBack();
        }}
      />

    </>
  );
};

export default HeaderGroupChatDetail;
