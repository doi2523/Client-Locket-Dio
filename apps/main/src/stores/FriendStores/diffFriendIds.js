export const diffFriendIds = (apiFriends, cachedIds) => {
  const apiUidSet = new Set(apiFriends.map((f) => f.uid));
  const cachedUidSet = new Set(cachedIds.map((f) => f.uid));

  const newIds = apiFriends.filter((f) => !cachedUidSet.has(f.uid));
  const removedIds = cachedIds.filter((f) => !apiUidSet.has(f.uid));

  return { newIds, removedIds };
};
