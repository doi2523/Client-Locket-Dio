const { instanceFirestore } = require("../../libs/instanceFirestore.js");

const getAllFriends = async (idToken, localId) => {
  const GET_ACCOUNT_INFO_URL_V2 = process.env.FIRESTORE_DEFAULT;

  const baseUrl = `${GET_ACCOUNT_INFO_URL_V2}${localId}/friends`;
  console.log(baseUrl);

  let pageToken = null;
  const allFriends = [];

  try {
    do {
      const url = pageToken
        ? `${baseUrl}?pageSize=100&pageToken=${pageToken}`
        : `${baseUrl}?pageSize=100`;

      const response = await instanceFirestore.get(url, { meta: { idToken } });
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
      error.response?.data || error.message,
    );
    return []; // Trả về mảng rỗng nếu lỗi
  }
};

module.exports = {
  getAllFriends,
};
