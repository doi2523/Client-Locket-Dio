const getAllMessages = async (idToken, userId, pageToken, limit = 20) => {
  const headers = {
    ...LOGIN_HEADERS,
    Authorization: `Bearer ${idToken}`,
    Accept: "application/json",
  };

  const params = {
    pageSize: limit,
    orderBy: "last_updated desc", // hoặc "updateTime desc"
  };

  if (pageToken) params.pageToken = pageToken;

  try {
    const response = await axios.get(url, { headers, params });

    const documents = response.data.documents || [];
    // Chuẩn hoá dữ liệu Firestore -> plain object
    const conversations = documents.map((doc) => normalizeMessage(doc));

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
function normalizeMessage(doc) {
  if (!doc || !doc.fields) return null;

  const f = doc.fields;

  return {
    id: f.uid?.stringValue || doc.name?.split("/").pop(),
    members: f.members?.arrayValue?.values?.map((v) => v.stringValue) || [],
    unreadCount: parseInt(f.unread_count?.integerValue || "0", 10),
    isRead: f.is_read?.booleanValue || false,

    lastReadAt: f.last_read_at?.timestampValue || null,
    otherLastReadAt: f.other_last_read_at?.timestampValue || null,
    lastUpdated: f.last_updated?.timestampValue || null,

    sender: f.latest_message.mapValue.fields.sender?.stringValue || "",

    // Tin nhắn mới nhất
    latestMessage: f.latest_message?.mapValue?.fields
      ? {
          body: f.latest_message.mapValue.fields.body?.stringValue || "",
          sender: f.latest_message.mapValue.fields.sender?.stringValue || "",
          createdAt:
            f.latest_message.mapValue.fields.created_at?.timestampValue || null,
          replyMoment:
            f.latest_message.mapValue.fields.reply_moment?.stringValue || null,
          thumbnailUrl: replaceFirebaseWithCDN(
            f.latest_message.mapValue.fields.thumbnail_url?.stringValue,
          ),
        }
      : null,

    otherLastDeliveredAt: f.other_last_delivered_at?.timestampValue || null,
    otherLastDeliveredMessageCreatedAt:
      f.other_last_delivered_message_created_at?.timestampValue || null,

    createTime: doc.createTime || null,
    updateTime: doc.updateTime || null,
  };
}
function replaceFirebaseWithCDN(url) {
  if (!url) return null; // hoặc "" nếu bạn muốn
  return url.replace(
    "https://firebasestorage.googleapis.com",
    "https://cdn.locketcamera.com",
  );
}