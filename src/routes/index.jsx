import AboutMe from "../pages/Auth/AboutMe";
import AuthHome from "../pages/Auth/Home";
import ToolsLocket from "../pages/Auth/LocketDioTools";
import PostMoments from "../pages/Auth/PostMoments";
import Profile from "../pages/Auth/Profile";
import AboutLocketDio from "../pages/Public/About";
import Contact from "../pages/Public/Contact";
import Docs from "../pages/Public/Docs";
import DonateHistory from "../pages/Public/HistoryDonate";
import Home from "../pages/Public/Home";
import Login from "../pages/Public/Login";
import PrivacyPolicy from "../pages/Public/PrivacyPolicy";
import RegisterMemberPage from "../pages/Public/RegisterMemberPage";
import Timeline from "../pages/Public/Timeline";
import CameraCapture from "../pages/UILocket";

const APP_NAME = "Locket Dio - Đăng ảnh & Video lên Locket";

// 📌 Các route dành cho người chưa đăng nhập
const publicRoutes = [
  { path: "/", component: Home, title: `${APP_NAME} | Trang Chủ` },
  { path: "/test", component: AuthHome, title: `${APP_NAME} | Test` },
  { path: "/login", component: Login, title: `${APP_NAME} | Đăng Nhập` },
  { path: "/about", component: AboutLocketDio, title: `${APP_NAME} | Về Website Locket Dio` },
  { path: "/about-dio", component: AboutMe, title: `${APP_NAME} | Về Dio` },
  { path: "/timeline", component: Timeline, title: `${APP_NAME} | Dòng Thời Gian` },
  { path: "/docs", component: Docs, title: `${APP_NAME} | Docs` },
  { path: "/contact", component: Contact, title: `${APP_NAME} | Liên hệ` },
  { path: "/privacy", component: PrivacyPolicy, title: `${APP_NAME} | Privacy Policy for LocketDio - PrivacyPolicies.com` },
  { path: "/testv1", component: CameraCapture, title: `${APP_NAME} | Test` },
  { path: "/upgrade", component: RegisterMemberPage, title: `${APP_NAME} | Đăng ký gói thành viên` },
  { path: "/locketdio-tools", component: ToolsLocket, title: `${APP_NAME} | Công cụ mở rộng` },
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
  { path: "/upgrade", component: RegisterMemberPage, title: `${APP_NAME} | Đăng ký gói thành viên` },

  { path: "/locket", component: CameraCapture, title: `${APP_NAME} | Locket` },
  { path: "/locketdio-tools", component: ToolsLocket, title: `${APP_NAME} | Công cụ mở rộng` },
];

// 📌 Các route dành cho locket
const locketRoutes = [
  // { path: "/test", component: CameraCapture, title: `${APP_NAME} | Trang chủ` },
];

export { publicRoutes, authRoutes, locketRoutes };
