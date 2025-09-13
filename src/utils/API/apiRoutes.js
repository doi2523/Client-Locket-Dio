//api/apiRoutes.js

import { CONFIG } from "@/config";

const BASE_API_URL = CONFIG.api.baseUrl;
const BASE_DB_API_URL = CONFIG.api.database;

const LOCKET_URL = "/locket";
const LOCKET_PRO = "/locketpro";

export const API_URL = {
  //API trung gian giao tiếp với locket
  CHECK_SERVER: `${BASE_API_URL}/`,
  LOGIN_URL: `${BASE_API_URL}${LOCKET_URL}/login`,
  LOGIN_URL_V2: `${BASE_API_URL}${LOCKET_URL}/loginV2`,
  LOGIN_URL_V3: `${BASE_API_URL}${LOCKET_URL}/loginV2`,
  LOGOUT_URL: `${LOCKET_URL}/logout`,
  CHECK_AUTH_URL: `${BASE_API_URL}${LOCKET_URL}/checkauth`,
  GET_INFO_URL: `${BASE_API_URL}${LOCKET_URL}/getinfo`,
  REFESH_TOKEN_URL: `${BASE_API_URL}${LOCKET_URL}/refresh-token`,
  GET_LIST_FRIENDS_URL: `${BASE_API_URL}${LOCKET_URL}/get-allfriends`,
  UPLOAD_MEDIA_URL_V2: `${LOCKET_URL}/postMomentV2`,
  UPLOAD_MEDIA_URL: `${BASE_API_URL}${LOCKET_URL}/post`,
  GET_USER: `https://api.locketcamera.com/fetchUserV2`,
  GET_INCOMING_URL: `${BASE_API_URL}${LOCKET_URL}/get-incoming_friends`,
  DELETE_FRIEND_REQUEST_URL: `${LOCKET_URL}/delete-incoming_friends`,
  DELETE_FRIEND_URL: `${BASE_API_URL}${LOCKET_URL}/delete_friends`,
  SPOTIFY_URL: "/api/spotifyV2",
  REGISTER_PUSH_URL: `${BASE_API_URL}/api/push/register`,
  GET_UPLOAD_STATS_URL: `${BASE_API_URL}${LOCKET_URL}/get-upload-stats`,
  GET_WEATHER_URL: `${BASE_API_URL}/api/weather`,
  GET_WEATHER_URL_V2: `${BASE_API_URL}/api/weatherV2`,
  ME_URL: `${BASE_API_URL}/api/me`,
  FORGOT_PASSWORD_URL: `${BASE_API_URL}${LOCKET_URL}/resetPassword`,

  //API lấy dữ liệu từ máy chủ
  GET_LASTEST_URL: `${BASE_API_URL}${LOCKET_PRO}/getmoment`,
  GET_CAPTION_THEMES: `${BASE_DB_API_URL}${LOCKET_PRO}/themes`,
  GET_TIMELINE: `${BASE_DB_API_URL}${LOCKET_PRO}/timelines`,
  DONATE_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/donations`,
  NOTIFI_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/notification`,
  GET_FRAMES_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/myframes`,
  USER_THEMES_POSTS_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/user-themes/posts`,
  POST_USER_THEMES_POSTS_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/user-themes/posts`,
  CAPTION_POSTS_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/user-themes/caption-posts`,
  SUBCRIBE: `${BASE_DB_API_URL}${LOCKET_PRO}/subscribe`,
  REGISTER_USER_PLANS: `${BASE_DB_API_URL}${LOCKET_PRO}/user-plans/register-free`,
  //Get plan user
  GET_USER_PLANS: `${BASE_DB_API_URL}${LOCKET_PRO}/user-plans`,
  GET_DIO_PLANS: `${BASE_DB_API_URL}${LOCKET_PRO}/dio-plans`,
  GET_COLLABORATORS: `${BASE_DB_API_URL}${LOCKET_PRO}/collaborator`,
  GET_COLLECTIONS: `${BASE_DB_API_URL}${LOCKET_PRO}/collections`,
};
