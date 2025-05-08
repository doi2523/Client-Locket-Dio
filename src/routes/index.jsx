import AboutMe from "../pages/Auth/AboutMe";
import AuthHome from "../pages/Auth/Home";
import PostMoments from "../pages/Auth/PostMoments";
import Profile from "../pages/Auth/Profile";
import Docs from "../pages/Public/Docs";
import DonateHistory from "../pages/Public/HistoryDonate";
import Home from "../pages/Public/Home";
import Login from "../pages/Public/Login";
import Timeline from "../pages/Public/Timeline";
import CameraCapture from "../pages/UILocket";

const APP_NAME = "Locket Pro - Đăng ảnh & Video lên Locket";

// 📌 Các route dành cho người chưa đăng nhập
const publicRoutes = [
  { path: "/", component: Home, title: `${APP_NAME} | Trang Chủ` },
  { path: "/test", component: AuthHome, title: `${APP_NAME} | Test` },
  { path: "/login", component: Login, title: `${APP_NAME} | Đăng Nhập` },
  // { path: "/testv1", component: AboutMe, title: `${APP_NAME} | Test` },
  // { path: "/testv2", component: Docs, title: `${APP_NAME} | Đăng Moment Mới` },
];

// 📌 Các route yêu cầu đăng nhập
const authRoutes = [
  { path: "/home", component: AuthHome, title: `${APP_NAME} | Trang chủ` },
  { path: "/profile", component: Profile, title: `${APP_NAME} | Hồ sơ` },
  { path: "/postmoments", component: PostMoments, title: `${APP_NAME} | Đăng Moment Mới` },
  { path: "/test", component: CameraCapture, title: `${APP_NAME} | Đăng Video Mới` },
  { path: "/timeline", component: Timeline, title: `${APP_NAME} | Dòng Thời Gian` },
  { path: "/aboutdio", component: AboutMe, title: `${APP_NAME} | Về Dio` },
  { path: "/docs", component: Docs, title: `${APP_NAME} | Docs` },
  { path: "/donatehistory", component: DonateHistory, title: `${APP_NAME} | DonateHistory` },

  { path: "/locket", component: CameraCapture, title: `${APP_NAME} | Trang Chủ` },
];

// 📌 Các route dành cho locket
const locketRoutes = [
  // { path: "/test", component: CameraCapture, title: `${APP_NAME} | Trang chủ` },
];

export { publicRoutes, authRoutes, locketRoutes };
