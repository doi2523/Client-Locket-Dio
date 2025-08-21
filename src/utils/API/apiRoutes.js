//const BASE_API_URL = "https://my-api-locket.vercel.app"; //http://localhost:5004
//const BASE_API_URL = "http://localhost:5004";//https://my-api-locket-production.up.railway.app/
//const BASE_API_URL = "https://my-api-locket-production.up.railway.app";//https://my-api-locket.onrender.com
//const BASE_API_URL = "https://apilocket-diov2.onrender.com";
// const BASE_API_URL = "https://api-locket-dio-v2.vercel.app";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
const BASE_DB_API_URL = import.meta.env.VITE_BASE_API_URL_DB;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_API_URL;
// const BASE_API_URL = "https://apilocket-diov2-production.up.railway.app";

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

  //API lấy dữ liệu từ máy chủ
  GET_LASTEST_URL: `${BASE_API_URL}${LOCKET_PRO}/getmoment`,
  GET_CAPTION_THEMES: `${BASE_DB_API_URL}${LOCKET_PRO}/themes`,
  GET_TIMELINE: `${BASE_DB_API_URL}${LOCKET_PRO}/timelines`,
  DONATE_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/donations`,
  NOTIFI_URL: `${BASE_DB_API_URL}${LOCKET_PRO}/notification`,
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

  //API dữ liệu Cloudinary
  UPLOAD_IMAGE_TO_CLOUD: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  UPLOAD_VIDEO_TO_CLOUD: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
};
