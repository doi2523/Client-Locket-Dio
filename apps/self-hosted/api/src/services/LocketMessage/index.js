const { instanceFirestore } = require("../../libs");

const getAllMessages = async (idToken, userId, pageToken, limit = 20) => {
  const params = {
    pageSize: limit,
    orderBy: "last_updated desc", // hoặc "updateTime desc"
  };

  if (pageToken) params.pageToken = pageToken;

  try {
    const response = await instanceFirestore.get(
      `/(default)/documents/users/${userId}/conversations`,
      {
        params,
        meta: {
          idToken,
        },
      },
    );
    const documents = response.data.documents || [];
    // Chuẩn hoá dữ liệu Firestore -> plain object
    const conversations = documents.map((doc) => normalizeMessage(doc, userId));

    return {
      messages: conversations,
      nextPageToken: response.data.nextPageToken || null,
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy mess:",
      error.response?.data || error.message,
    );
    return {
      messages: [],
      nextPageToken: null,
    };
  }
};
function normalizeMessage(doc, user_id) {
  if (!doc || !doc.fields) return null;

  const f = doc.fields;

  const members = f.members?.arrayValue?.values || [];

  const memberList = members.map((v) => v.stringValue);

  const with_user = memberList.find((id) => id !== user_id);

  const latest = f.latest_message?.mapValue?.fields;

  const toSeconds = (ts) =>
    ts ? Math.floor(new Date(ts).getTime() / 1000) : 0;

  return {
    uid: f.uid?.stringValue || doc.name?.split("/").pop(),

    members: memberList,

    unreadCount: parseInt(f.unread_count?.integerValue || "0", 10),

    isRead: f.is_read?.booleanValue || false,

    lastReadAt: toSeconds(f.last_read_at?.timestampValue),

    otherLastReadAt: toSeconds(f.other_last_read_at?.timestampValue),

    lastUpdated: toSeconds(f.last_updated?.timestampValue),

    // 👇 thêm field bị thiếu
    update_time: toSeconds(latest?.created_at?.timestampValue),

    latestMessage: latest
      ? {
          body: latest.body?.stringValue || "",
          sender: latest.sender?.stringValue || "",
          createdAt: toSeconds(latest.created_at?.timestampValue),
          replyMoment: latest.reply_moment?.stringValue || null,
          thumbnailUrl: replaceFirebaseWithCDN(
            latest.thumbnail_url?.stringValue,
          ),
        }
      : null,

    otherLastDeliveredAt: toSeconds(f.other_last_delivered_at?.timestampValue),

    otherLastDeliveredMessageCreatedAt: toSeconds(
      f.other_last_delivered_message_created_at?.timestampValue,
    ),

    with_user,

    createTime: toSeconds(doc.createTime),

    updateTime: toSeconds(doc.updateTime),
  };
}
function replaceFirebaseWithCDN(url) {
  if (!url) return null; // hoặc "" nếu bạn muốn
  return url.replace(
    "https://firebasestorage.googleapis.com",
    "https://cdn.locketcamera.com",
  );
}

module.exports = {
  getAllMessages,
};
