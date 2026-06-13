import React from "react";

export const SystemMessage = ({ content, actorUid, targetUid, getName }) => {
  const actorName = getName(actorUid);
  const targetName = getName(targetUid);

  let sysText = "";
  if (content.type === "userAddedToGroup") {
    sysText = actorName
      ? targetName ? `${actorName} đã thêm ${targetName} vào nhóm` : `${actorName} đã thêm thành viên vào nhóm`
      : targetName ? `Đã thêm ${targetName} vào nhóm` : "Đã thêm thành viên vào nhóm";
  } else if (content.type === "userRemovedFromGroup") {
    sysText = actorName
      ? targetName ? `${actorName} đã xoá ${targetName} khỏi nhóm` : `${actorName} đã xoá thành viên khỏi nhóm`
      : targetName ? `Đã xoá ${targetName} khỏi nhóm` : "Đã xoá thành viên khỏi nhóm";
  } else if (content.type === "groupNameChanged") {
    sysText = actorName ? `${actorName} đã đổi tên nhóm thành "${content.name || ""}"` : `Đã đổi tên nhóm thành "${content.name || ""}"`;
  } else if (content.type === "groupImageChanged") {
    sysText = actorName ? `${actorName} đã thay đổi ảnh đại diện nhóm` : "Đã thay đổi ảnh đại diện nhóm";
  }
  
  return (
    <div className="text-center text-[11px] text-base-content/50 font-semibold py-2">{sysText}</div>
  );
};
