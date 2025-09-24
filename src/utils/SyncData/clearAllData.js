import { clearMoments } from "@/cache/momentDB";
import { clearAuthStorage, clearLocalData } from "../storage";
import { clearAuthData, removeUser } from "../storage/helpers";
import { clearFriendDetails, clearFriendIds } from "@/cache/friendsDB";

export const clearAllData = async () => {
  //   localStorage.clear();
  clearAuthData();
  removeUser();
  clearAuthStorage();
  clearLocalData();
  await clearMoments();
  await clearFriendIds();
  await clearFriendDetails();
};
