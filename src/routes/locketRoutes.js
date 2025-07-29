import React from "react";

const CameraCapture = React.lazy(() => import("../pages/UILocket"));
const HomePages = React.lazy(() => import("../pages/UILocket/ExtendPage/pages/ProfilePage"));
const HistorysPage = React.lazy(() => import("../pages/UILocket/ExtendPage/pages/HistorysPage"));
const SettingsPage = React.lazy(() => import("../pages/UILocket/ExtendPage/pages/SettingsPage"));

const APP_NAME = "Locket Dio - Đăng ảnh & Video lên Locket";

export const locketRoutes = [
  { path: "/locket", component: CameraCapture, title: `Locket Camera | ${APP_NAME}` },
  { path: "/locket/profile", component: HomePages, title: `Trang cá nhân | ${APP_NAME}` },
  { path: "/locket/history", component: HistorysPage, title: `Lịch sử | ${APP_NAME}` },
  { path: "/locket/settings", component: SettingsPage, title: `Cài đặt Locket | ${APP_NAME}` },
];