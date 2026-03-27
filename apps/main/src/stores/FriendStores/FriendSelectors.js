import { useMemo } from "react";
import { useFriendStoreV3 } from "./useFriendStoreV3";

export const useFriendObjects = () => {
  const friendList = useFriendStoreV3((s) => s.friendList);
  const friendDetailsMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const friendRelationsMap = useFriendStoreV3((s) => s.friendRelationsMap);

  return useMemo(() => {
    return friendList.map((uid) => ({
      uid,
      ...friendDetailsMap[uid],
      relation: friendRelationsMap[uid] || {},
    }));
  }, [friendList, friendDetailsMap, friendRelationsMap]);
};

export const useFriendObjectsV2 = () => {
  const friendList = useFriendStoreV3((s) => s.friendList);
  const friendDetailsMap = useFriendStoreV3((s) => s.friendDetailsMap);
  const friendRelationsMap = useFriendStoreV3((s) => s.friendRelationsMap);

  return useMemo(() => {
    return friendList.map((uid) => ({
      uid,
      info: friendDetailsMap[uid],
      relation: friendRelationsMap[uid] || {},
    }));
  }, [friendList, friendDetailsMap, friendRelationsMap]);
};

export const useFriendList = () => useFriendStoreV3((s) => s.friendList);

export const useFriendInfo = (uid) =>
  useFriendStoreV3((s) => s.friendDetailsMap[uid]);

export const useFriendRelation = (uid) =>
  useFriendStoreV3((s) => s.friendRelationsMap[uid]);

export const useFriendIds = () => useFriendStoreV3((s) => s.friendList);

export const useFriendDetailsMap = () =>
  useFriendStoreV3((s) => s.friendDetailsMap);

export const useNormalFriendIds = () => {
  const friendIds = useFriendIds();
  const friendDetailsMap = useFriendDetailsMap();

  return useMemo(() => {
    return friendIds.filter((uid) => {
      const info = friendDetailsMap[uid];
      return !info?.isCelebrity;
    });
  }, [friendIds, friendDetailsMap]);
};
