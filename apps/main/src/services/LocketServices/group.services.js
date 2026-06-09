import { instanceLocketV2 } from "@/libs";
import { generateUUIDv4Upper } from "@/utils/generate/uuid";

export const getGroupsState = async ({ groupIds, lastFetchedAt } = {}) => {
  try {
    const body = { data: {} };

    if (groupIds?.length) {
      body.data.current_group_ids = groupIds;
    }

    if (lastFetchedAt) {
      body.data.last_fetched_at = {
        "@type": "type.googleapis.com/google.protobuf.Int64Value",
        value: String(lastFetchedAt),
      };
    }

    const res = await instanceLocketV2.post("getGroupsState", body);
    return res.data?.result?.data ?? null;
  } catch (error) {
    console.error("Error fetching groups state:", error);
    throw error;
  }
};

export const getGroupMessages = async ({ groupId, limit = 40, beforeTimestamp = null } = {}) => {
  try {
    const body = {
      data: {
        limit: {
          "@type": "type.googleapis.com/google.protobuf.Int64Value",
          value: String(limit),
        },
        group_id: groupId,
      }
    };

    if (beforeTimestamp) {
      body.data.before_timestamp = {
        "@type": "type.googleapis.com/google.protobuf.Int64Value",
        value: String(beforeTimestamp),
      };
    }

    const res = await instanceLocketV2.post("getGroupMessages", body);
    return res.data?.result?.data ?? null;
  } catch (error) {
    console.error("Error fetching group messages:", error);
    throw error;
  }
};

export const sendGroupMessage = async ({ groupId, message, client_token } = {}) => {
  try {
    const body = {
      data: {
        type: "sendMessage",
        group_id: groupId,
        message: message,
        client_token: client_token || generateUUIDv4Upper(),
      },
    };

    const res = await instanceLocketV2.post("groupChatOp", body);
    return res.data?.result?.data ?? null;
  } catch (error) {
    console.error("Error sending group message:", error);
    throw error;
  }
};

export const markGroupAsRead = async ({ groupId, timestamp } = {}) => {
  try {
    const body = {
      data: {
        type: "markAsRead",
        group_id: groupId,
        timestamp: {
          "@type": "type.googleapis.com/google.protobuf.Int64Value",
          value: String(timestamp || Date.now()),
        },
      },
    };

    await instanceLocketV2.post("groupChatOp", body);
  } catch (error) {
    console.error("Error marking group as read:", error);
  }
};

export const toggleGroupMute = async ({ groupId, muted }) => {
  try {
    const body = {
      data: {
        muted,
        type: "toggleMute",
        group_id: groupId,
      },
    };

    await instanceLocketV2.post("groupChatOp", body);
  } catch (error) {
    console.error("Error toggling group mute:", error);
    throw error;
  }
};

export const addGroupMember = async ({ groupId, userId }) => {
  try {
    const body = {
      data: {
        user_id: userId,
        type: "addUser",
        group_id: groupId,
      },
    };

    const res = await instanceLocketV2.post("groupUserOp", body);
    return res.data?.result?.data?.group ?? null;
  } catch (error) {
    console.error("Error adding group member:", error);
    throw error;
  }
};

export const removeGroupMember = async ({ groupId, userId, timestamp } = {}) => {
  try {
    const body = {
      data: {
        timestamp: {
          "@type": "type.googleapis.com/google.protobuf.Int64Value",
          value: String(timestamp || Date.now()),
        },
        user_id: userId,
        type: "removeUser",
        fully_remove_self: false,
        group_id: groupId,
      },
    };

    const res = await instanceLocketV2.post("groupUserOp", body);
    return res.data?.result?.data?.group ?? null;
  } catch (error) {
    console.error("Error removing group member:", error);
    throw error;
  }
};

export const updateGroupName = async ({ groupId, name }) => {
  try {
    const body = {
      data: {
        group_id: groupId,
        name,
      },
    };

    const res = await instanceLocketV2.post("updateGroup", body);
    return res.data?.result?.data?.group ?? null;
  } catch (error) {
    console.error("Error updating group name:", error);
    throw error;
  }
};

export const createGroup = async ({ userIds, initialMessage } = {}) => {
  try {
    const body = {
      data: {
        users: userIds,
        initial_message: {
          content: initialMessage || "Chào cả nhà mình nhá",
          client_token: generateUUIDv4Upper(),
        },
      },
    };

    const res = await instanceLocketV2.post("createGroup", body);
    return res.data?.result?.data?.group ?? null;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

export const updateGroupAvatar = async ({ groupId, imageUrl }) => {
  try {
    const body = {
      data: {
        image_url: imageUrl,
        group_id: groupId,
      },
    };

    const res = await instanceLocketV2.post("updateGroup", body);
    return res.data?.result?.data?.group ?? null;
  } catch (error) {
    console.error("Error updating group avatar:", error);
    throw error;
  }
};
