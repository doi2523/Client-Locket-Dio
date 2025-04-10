//const BASE_API_URL = "https://my-api-locket.vercel.app"; //http://localhost:5004
const BASE_API_URL = "http://localhost:5004";//https://my-api-locket-production.up.railway.app/
//const BASE_API_URL = "https://my-api-locket-production.up.railway.app";https://my-api-locket.onrender.com
//const BASE_API_URL = "https://apilocket-diov2.onrender.com";
//const BASE_API_URL = "https://api-locket-dio-v2.vercel.app";
//const BASE_API_URL = "https://apilocket-diov2-production.up.railway.app";

const LOCKET_URL = "/locket";

export const API_URL = {
  LOGIN_URL: `${BASE_API_URL}${LOCKET_URL}/login`,
  LOGIN_URL_V2: `${BASE_API_URL}${LOCKET_URL}/loginV2`,
  LOGOUT_URL: `${BASE_API_URL}${LOCKET_URL}/logout`,
  CHECK_AUTH_URL: `${BASE_API_URL}${LOCKET_URL}/checkauth`,
  GET_INFO_URL: `${BASE_API_URL}${LOCKET_URL}/getinfo`,
  
  UPLOAD_MEDIA_URL: `${BASE_API_URL}${LOCKET_URL}/post`,
  GET_LASTEST_URL: `${BASE_API_URL}${LOCKET_URL}/getmoment`,
  //Cloudinary
  UPLOAD_IMAGE_TO_CLOUD: `https://api.cloudinary.com/v1_1/diocloud/image/upload`,
  UPLOAD_VIDEO_TO_CLOUD: `https://api.cloudinary.com/v1_1/diocloud/video/upload`,
  
  CHECK_SERVER: `${BASE_API_URL}/`
};