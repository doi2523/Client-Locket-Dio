import { CONFIG } from "@/config";
import React from "react";
// import CameraCapture from "../pages/LocketCamera";

// const CameraCapture = React.lazy(() => import("../pages/LocketCamera"));
const CameraCaptureBeta = React.lazy(() => import("../pages/LocketCameraBeta"));

const APP_NAME = CONFIG.app.fullName;

export const locketRoutes = [
  // {
  //   path: "/locket",
  //   component: CameraCapture,
  //   title: `Locket Camera | ${APP_NAME}`,
  // },
  { path: "/locket-beta", component: CameraCaptureBeta, title: `Locket Camera Beta | ${APP_NAME}` },
  // { path: "/locket/history", component: HistorysPage, title: `Lịch sử | ${APP_NAME}` },
  // { path: "/locket/settings", component: SettingsPage, title: `Cài đặt Locket | ${APP_NAME}` },
];
