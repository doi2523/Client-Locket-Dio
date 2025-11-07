import { clearMoments } from "@/cache/momentDB";
import { clearAuthStorage, clearLocalData } from "../storage";
import { clearAuthData, removeUser } from "../storage/helpers";
import { clearFriendDetails, clearFriendIds } from "@/cache/friendsDB";
import { clearAllDB } from "@/cache/configDB";
import { clearConversations, clearMessages } from "@/cache/chatsDB";

export const clearAllData = async () => {
  //   localStorage.clear();
  clearAuthData();
  removeUser();
  clearAuthStorage();
  clearLocalData();
  await clearAllDB()
  // await clearMoments();
  // await clearFriendIds();
  // await clearFriendDetails();
  // await clearConversations();
  // await clearMessages();
};
