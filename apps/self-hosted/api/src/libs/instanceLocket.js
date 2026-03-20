const axios = require("axios");
const serverConfig = require("../config/app.config");

const loginHeader = {
  "Content-Type": "application/json",
  "Accept-Language": "en-US",
  "X-Ios-Bundle-Identifier": "com.locket.Locket",
  "baggage": "sentry-environment=production,sentry-public_key=78fa64317f434fd89d9cc728dd168f50,sentry-release=com.locket.Locket%401.121.1%2B1,sentry-trace_id=2cdda588ea0041ed93d052932b127a3e",
  "sentry-trace": "2cdda588ea0041ed93d052932b127a3e-a3e2ba7a095d4f9d-0",
  "User-Agent": "FirebaseAuth.iOS/10.23.1 com.locket.Locket/2.8.0 iPhone/18.0 hw/iPhone12_1",
  "X-Client-Version": "iOS/FirebaseSDK/10.23.1/FirebaseCore-iOS",
  "X-Firebase-GMPID": "1:641029076083:ios:cc8eb46290d69b234fa606",
  "X-Firebase-Client": "H4sIAAAAAAAAAKtWykhNLCpJSk0sKVayio7VUSpLLSrOzM9TslIyUqoFAFyivEQfAAAA",
  "Firebase-Intance-ID-Token": "dIIokP3BqUpqtg_4ETWpqo:APA91bGJpQcQNrUeUCNR0e-Si9vT6ixqqiDZHYyg6OYTQ19b4-LPwgWpz5K66KU_W_HYL3vxBgGhr1ATs05VLeXI6OhQiYtvZrwHjQkFOVyDs-HLtIN7z68"
};

const BASE_URL_LOCKET = serverConfig.function.locketApi;

const instanceLocketV2 = axios.create({
  baseURL: BASE_URL_LOCKET,
  timeout: 30000,
  headers: {
    ...loginHeader,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor: thêm token động trước mỗi request
instanceLocketV2.interceptors.request.use(
  (config) => {
    const token = config?.meta?.idToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const appCheckToken = config?.meta?.appCheckToken;

    if (appCheckToken) {
      config.headers["X-Firebase-AppCheck"] = appCheckToken;
    } else {
      config.headers["X-Firebase-AppCheck"] = "eyJraWQiOiJNbjVDS1EiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOjY0MTAyOTA3NjA4Mzppb3M6Y2M4ZWI0NjI5MGQ2OWIyMzRmYTYwNiIsImF1ZCI6WyJwcm9qZWN0c1wvNjQxMDI5MDc2MDgzIiwicHJvamVjdHNcL2xvY2tldC00MjUyYSJdLCJwcm92aWRlciI6ImRldmljZV9jaGVja19kZXZpY2VfaWRlbnRpZmljYXRpb24iLCJpc3MiOiJodHRwczpcL1wvZmlyZWJhc2VhcHBjaGVjay5nb29nbGVhcGlzLmNvbVwvNjQxMDI5MDc2MDgzIiwiZXhwIjoxNzIyMTY3ODk4LCJpYXQiOjE3MjIxNjQyOTgsImp0aSI6ImlHUGlsT1dDZGg4Mll3UTJXRC1neEpXeWY5TU9RRFhHcU5OR3AzTjFmRGcifQ.lqTOJfdoYLpZwYeeXtRliCdkVT7HMd7_Lj-d44BNTGuxSYPIa9yVAR4upu3vbZSh9mVHYS8kJGYtMqjP-L6YXsk_qsV_gzKC2IhVAV6KbPDRHdevMfBC6fRiOSVn7vt749GVFdZqAuDCXhCILsaMhvgDBgZoDilgAPtpNwyjz-VtRB7OdOUbuKTCqdoSOX0SJWVUMyuI8nH0-unY--YRctunK8JHZDxBaM_ahVggYPWBCpzxq9Yeq8VSPhadG_tGNaADStYPaeeUkZ7DajwWqH5ze6ESpuFNgAigwPxCM735_ZiPeD7zHYwppQA9uqTWszK9v9OvWtFCsgCEe22O8awbNbuEBTKJpDQ8xvZe8iEYyhfUPncER3S-b1CmuXR7tFCdTgQe5j7NGWjFvN_CnL7D2nudLwxWlpqwASCHvHyi8HBaJ5GpgriTLXAAinY48RukRDBi9HwEzpRecELX05KTD2lTOfQCjKyGpfG2VUHP5Xm36YbA3iqTDoDXWMvV";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

module.exports = { instanceLocketV2 };
