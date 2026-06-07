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
