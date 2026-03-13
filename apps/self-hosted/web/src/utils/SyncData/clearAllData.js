import { clearAuthStorage, clearLocalData } from "../storage";
import { clearAuthData, removeUser } from "../storage/helpers";
import { clearAllDB } from "@/cache/configDB";

export const clearAllData = async () => {
  clearAuthData();
  removeUser();
  clearAuthStorage();
  clearLocalData();
  await clearAllDB()
};
