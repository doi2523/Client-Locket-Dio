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
  LOGOUT_URL: `${LOCKET_URL}/logout`,
  REFESH_TOKEN_URL: `${BASE_API_URL}${LOCKET_URL}/refresh-token`,
  UPLOAD_MEDIA_URL_V2: `${LOCKET_URL}/postMomentV2`,
  UPLOAD_MEDIA_URL: `${BASE_API_URL}${LOCKET_URL}/post`,
  REGISTER_PUSH_URL: `${BASE_API_URL}/api/push/register`,
  //Get plan user
  GET_DIO_PLANS: `${BASE_DB_API_URL}${LOCKET_PRO}/dio-plans`,
  GET_COLLECTIONS: `${BASE_DB_API_URL}${LOCKET_PRO}/collections`,
};
