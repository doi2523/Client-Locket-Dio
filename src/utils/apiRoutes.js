//const BASE_API_URL = "https://my-api-locket.vercel.app"; //http://localhost:5004
//const BASE_API_URL = "http://localhost:5004";https://my-api-locket-production.up.railway.app/
const BASE_API_URL = "https://my-api-locket-production.up.railway.app";

const LOCKET_URL = "/locket";

export const API_URL = {
  LOGIN_URL: `${BASE_API_URL}${LOCKET_URL}/login`,
  LOGOUT_URL: `${BASE_API_URL}${LOCKET_URL}/logout`,
  CHECK_AUTH_URL: `${BASE_API_URL}${LOCKET_URL}/checkauth`,
  GET_INFO_URL: `${BASE_API_URL}${LOCKET_URL}/getinfo`,
  
  UPLOAD_MEDIA_URL: `${BASE_API_URL}${LOCKET_URL}/post`,
  GET_LASTEST_URL: `${BASE_API_URL}${LOCKET_URL}/getmoment`,
};