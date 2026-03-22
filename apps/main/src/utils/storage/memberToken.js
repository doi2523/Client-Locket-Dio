import { CACHE_CONFIG } from "@/config";

const TOKEN_KEY = CACHE_CONFIG.keys.memberToken;
const HEADER_KEY = CACHE_CONFIG.keys.memberHeader;

export const saveMemberToken = (session) => {
  if (!session?.member_token) return;

  localStorage.setItem(TOKEN_KEY, session.member_token);
  localStorage.setItem(HEADER_KEY, session.header || "X-LocketDio-Member");
};

export const getMemberToken = () => {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    header: localStorage.getItem(HEADER_KEY) || "X-LocketDio-Member",
  };
};

export const clearMemberToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(HEADER_KEY);
};