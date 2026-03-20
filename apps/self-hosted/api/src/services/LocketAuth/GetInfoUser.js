const { instanceFirestore, instanceFirebaseV2 } = require("../../libs");

// Lấy thông tin người dùng
const getUserInfoV2 = async (idToken, localId) => {
  try {
    const authResponse = await instanceFirebaseV2.post("getAccountInfo", {
      idToken,
    });
    const userData = authResponse.data?.users?.[0];
    if (!userData) throw new Error("Không tìm thấy user trong Firebase Auth.");
    // console.log(userData);
    const firestoreResponse = await instanceFirestore.get(
      `(default)/documents/users/${localId}`,
      {
        meta: {
          idToken,
        },
      },
    );

    const userDataV2 = firestoreResponse?.data;
    // console.log(userDataV2);
    return {
      uid: userDataV2?.fields?.uid?.stringValue || userData.localId,
      localId: userData.localId || localId,
      customAuth: userData.customAuth || null,
      phoneNumber: userData.phoneNumber || null,
      displayName: userData.displayName || null,
      email: userData.email || null,
      lastLoginAt: userData.lastLoginAt || null,
      lastRefreshAt: userData.lastRefreshAt || null,
      emailVerified: userData.emailVerified || null,

      username: userDataV2?.fields?.username?.stringValue || null,
      firstName: userDataV2?.fields?.first_name?.stringValue || null,
      lastName: userDataV2?.fields?.last_name?.stringValue || null,
      profilePicture:
        userDataV2?.fields?.profile_picture_url?.stringValue || null,
      inviteToken: userDataV2?.fields?.invite_token?.stringValue || null,
      migratedAt: userDataV2?.fields?.migrated_at?.timestampValue || null,
      createdAt: userDataV2?.fields?.created_at?.timestampValue || null,
      lastFriendsChange:
        userDataV2?.fields?.last_friends_change?.timestampValue || null,
      birthday:
        userDataV2?.fields?.birthday?.mapValue?.fields?.encoded_mdd
          ?.integerValue || null,
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy thông tin người dùng:",
      error.response?.data || error.message,
    );
    return null;
  }
};

module.exports = { getUserInfoV2 };
