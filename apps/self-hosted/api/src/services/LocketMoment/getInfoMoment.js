const { instanceFirestore } = require("../../libs");

const getInfoLocketMoments = async (idToken, idMoment) => {
  // Helper: fetch tất cả page nếu có nextPageToken
  const fetchAllDocs = async (path) => {
    let allDocs = [];
    let nextPageToken = null;

    do {
      try {
        const res = await instanceFirestore.get(path, {
          params: nextPageToken ? { pageToken: nextPageToken } : {},
          meta: {
            idToken,
          },
        });

        const docs = res.data?.documents || [];
        allDocs = allDocs.concat(docs);

        nextPageToken = res.data?.nextPageToken || null;
      } catch (err) {
        console.error(
          "❌ Lỗi khi fetch:",
          path,
          err.response?.data || err.message,
        );
        break;
      }
    } while (nextPageToken);

    return allDocs;
  };

  try {
    const reactionsDocs = await fetchAllDocs(
      `/(default)/documents/moments/${idMoment}/reactions`,
    );

    return {
      reactions: normalizeReactions(reactionsDocs),
      views: [],
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy info moment:",
      error.response?.data || error.message,
    );

    return {
      reactions: [],
      views: [],
    };
  }
};

function normalizeReactions(documents) {
  return documents.map((doc) => {
    const fields = doc.fields || {};
    return {
      id: doc.name.split("/").pop(),
      user: fields.user?.stringValue || null,
      emoji: fields.string?.stringValue || null,
      intensity: parseInt(fields.intensity?.integerValue || "0", 10),
      createdAt: fields.created_at?.timestampValue || null,
    };
  });
}

module.exports = {
  getInfoLocketMoments,
};
