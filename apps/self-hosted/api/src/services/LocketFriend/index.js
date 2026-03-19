const { instanceFirestore } = require("../../libs/instanceFirestore.js");

const getAllFriends = async (idToken, localId) => {
  let pageToken = null;
  const allFriends = [];

  try {
    do {
      const response = await instanceFirestore.get(
        `(default)/documents/users/${localId}/friends`,
        {
          params: {
            pageSize: 100,
            ...(pageToken && { pageToken }),
          },
          meta: { idToken },
        }
      );

      const documents = response.data.documents || [];

      const parsedFriends = documents.map((doc) => ({
        uid: doc.fields?.user?.stringValue,
        date: doc.createTime,
      }));

      allFriends.push(...parsedFriends);

      pageToken = response.data.nextPageToken || null;

    } while (pageToken);

    return allFriends;

  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy danh sách bạn bè:",
      error.response?.data || error.message
    );
    return [];
  }
};

module.exports = {
  getAllFriends,
};
