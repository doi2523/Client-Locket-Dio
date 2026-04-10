exports.getInfoLocketMoments = async (idToken, idMoment) => {
  const baseUrl = `https://firestore.googleapis.com/v1/projects/locket-4252a/databases/(default)/documents/moments/${idMoment}`;
  
  const headers = {
    Authorization: `Bearer ${idToken}`,
    Accept: "application/json",
    ...LOGIN_HEADERS,
  };

  // Helper: fetch tất cả page nếu có nextPageToken
  const fetchAllDocs = async (url) => {
    let allDocs = [];
    let nextPageToken = null;

    do {
      const finalUrl = nextPageToken
        ? `${url}?pageToken=${nextPageToken}`
        : url;

      try {
        const res = await axios.get(finalUrl, { headers });
        const docs = res.data.documents || [];
        allDocs = allDocs.concat(docs);
        nextPageToken = res.data.nextPageToken || null;
      } catch (err) {
        console.error(
          "❌ Lỗi khi fetch:",
          finalUrl,
          err.response?.data || err.message
        );
        break;
      }
    } while (nextPageToken);

    return allDocs;
  };

  const urlReactions = `${baseUrl}/reactions`;

  // 🚫 Tạm thời không dùng views
  // const urlViews = `${baseUrl}/moment_views`;

  try {
    const reactionsDocs = await fetchAllDocs(urlReactions);

    // Nếu sau này cần bật lại views:
    // const viewsDocs = await fetchAllDocs(urlViews);

    return {
      reactions: normalizeReactions(reactionsDocs),

      // views: normalizeViews(viewsDocs),
      views: [], // tạm thời trả rỗng để không vỡ cấu trúc
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy info moment:",
      error.response?.data || error.message
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
      id: doc.name.split("/").pop(), // id document reaction
      user: fields.user?.stringValue || null,
      emoji: fields.string?.stringValue || null,
      intensity: parseInt(fields.intensity?.integerValue || "0", 10),
      createdAt: fields.created_at?.timestampValue || null,
    };
  });
}