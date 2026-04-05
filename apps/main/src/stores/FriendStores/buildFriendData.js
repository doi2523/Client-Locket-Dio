/**
 * Build friendRelationsMap từ API
 * Array → Map (key = uid)
 *
 * Input (apiFriends):
 * [
 *   { uid: "user_1", hidden: false, isCelebrity: true, createdAt: 123 }
 * ]
 *
 * Output:
 * {
 *   user_1: { hidden: false, isCelebrity: true, createdAt: 123 }
 * }
 */
export const buildFriendRelationsMap = (apiFriends = []) => {
  return Object.fromEntries(
    apiFriends.map((f) => [
      f.uid,
      {
        hidden: f.hidden ?? false,
        sharedHistoryOn: f.sharedHistoryOn ?? null,
        isCelebrity: f.isCelebrity ?? false,
        createdAt: f.createdAt ?? Date.now(),
        updatedAt: f.updatedAt ?? Date.now(),
      },
    ]),
  );
};

/**
 * Build friendDetailsMap từ IndexedDB / API
 * Array → Map (key = uid)
 *
 * Input:
 * [
 *   { uid: "user_1", username: "dio", photoURL: "dio.jpg" }
 * ]
 *
 * Output:
 * {
 *   user_1: { uid: "user_1", username: "dio", photoURL: "dio.jpg" }
 * }
 */
export const buildFriendDetailsMap = (details = []) => {
  return Object.fromEntries(details.map((f) => [f.uid, f]));
};

/**
 * Merge 2 map → List để render UI
 *
 * friendDetailsMap + friendRelationsMap → friendList
 *
 * Output:
 * [
 *   {
 *     uid: "user_1",
 *     username: "dio",
 *     photoURL: "dio.jpg",
 *     hidden: false,
 *     isCelebrity: true,
 *     createdAt: 1711000000
 *   }
 * ]
 */
export const mergeFriendList = (friendDetailsMap, friendRelationsMap) => {
  return Object.values(friendDetailsMap).map((f) => ({
    ...f,
    ...friendRelationsMap[f.uid],
  }));
};
