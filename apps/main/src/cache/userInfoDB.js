import db from "./configDB";

export const putUserInfo = async (user) => {
  if (!user?.uid) return;
  try {
    await db.userInfo.put(user);
  } catch (err) {
    console.error("Error saving user info to cache:", err);
  }
};

export const getUserInfo = async (uid) => {
  if (!uid) return null;
  try {
    return (await db.userInfo.get(uid)) || null;
  } catch (err) {
    console.error("Error getting user info from cache:", err);
    return null;
  }
};

export const getAllUserInfo = async () => {
  try {
    return await db.userInfo.toArray();
  } catch (err) {
    console.error("Error getting all user info from cache:", err);
    return [];
  }
};

export const deleteUserInfo = async (uid) => {
  if (!uid) return;
  try {
    await db.userInfo.delete(uid);
  } catch (err) {
    console.error("Error deleting user info from cache:", err);
  }
};
