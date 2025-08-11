import CameraCapture from "../pages/UILocket";

// const CameraCapture = React.lazy(() => import("../pages/UILocket"));

const APP_NAME = "Locket Dio - Đăng ảnh & Video lên Locket";

export const locketRoutes = [
  { path: "/locket", component: CameraCapture, title: `Locket Camera | ${APP_NAME}` },
  // { path: "/locket/profile", component: HomePages, title: `Trang cá nhân | ${APP_NAME}` },
  // { path: "/locket/history", component: HistorysPage, title: `Lịch sử | ${APP_NAME}` },
  // { path: "/locket/settings", component: SettingsPage, title: `Cài đặt Locket | ${APP_NAME}` },
];