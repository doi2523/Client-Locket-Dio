import { instanceLocketV2 } from "@/libs";

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
