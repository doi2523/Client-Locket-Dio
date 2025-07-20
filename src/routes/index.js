import AboutMe from "../pages/Auth/AboutMe";
import AuthHome from "../pages/Auth/Home";
import ToolsLocket from "../pages/Auth/LocketDioTools";
import PostMoments from "../pages/Auth/PostMoments";
import Profile from "../pages/Auth/Profile";
import AboutLocketDio from "../pages/Public/About";
import AddToHomeScreenGuide from "../pages/Public/AddToScreen";
import ClearDataPage from "../pages/Public/ClearCache";
import Contact from "../pages/Public/Contact";
import DevPage from "../pages/Public/DevPage";
import Docs from "../pages/Public/Docs";
import ErrorReferencePage from "../pages/Public/ErrorReferencePage";
import DonateHistory from "../pages/Public/HistoryDonate";
import Home from "../pages/Public/Home";
import Login from "../pages/Public/Login";
import PayPage from "../pages/Public/PayPage";
import PricingPage from "../pages/Public/Pricing";
import PlanDetailPage from "../pages/Public/PricingDetail";
import PrivacyPolicy from "../pages/Public/PrivacyPolicy";
import RegisterMemberPage from "../pages/Public/RegisterMemberPage";
import Settings from "../pages/Public/Settings";
import Timeline from "../pages/Public/Timeline";
import CameraCapture from "../pages/UILocket";
import HistorysPage from "../pages/UILocket/ExtendPage/pages/HistorysPage";
import MainHomePage from "../pages/UILocket/ExtendPage/pages/MainHomePage";
import HomePages from "../pages/UILocket/ExtendPage/pages/ProfilePage";
import SettingsPage from "../pages/UILocket/ExtendPage/pages/SettingsPage";

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
  { path: "/locket", component: CameraCapture, title: `${APP_NAME} | Locket` },
  { path: "/contact", component: Contact, title: `${APP_NAME} | Liên hệ` },
  { path: "/privacy", component: PrivacyPolicy, title: `${APP_NAME} | Privacy Policy for LocketDio - PrivacyPolicies.com` },
  { path: "/testv1", component: CameraCapture, title: `${APP_NAME} | Test` },
  { path: "/upgrade", component: RegisterMemberPage, title: `${APP_NAME} | Đăng ký gói thành viên` },
  { path: "/pricing", component: PricingPage, title: `${APP_NAME} | Đăng ký gói thành viên` },
  { path: "/locketdio-tools", component: ToolsLocket, title: `${APP_NAME} | Công cụ mở rộng` },
  { path: "/settings", component: Settings, title: `${APP_NAME} | Cài đặt` },
  { path: "/devpage", component: DevPage, title: `${APP_NAME} | Dev Page` },
  { path: "/download", component: AddToHomeScreenGuide, title: `${APP_NAME} | Thêm ứng dụng vào màn hình chính` },
  { path: "/clear", component: ClearDataPage, title: `${APP_NAME} | Clear Cache Website` },
  { path: "/reference", component: ErrorReferencePage, title: `${APP_NAME} | Trung tâm lỗi & cách khắc phục` },
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
  { path: "/settings", component: Settings, title: `${APP_NAME} | Cài đặt` },
  { path: "/devpage", component: DevPage, title: `${APP_NAME} | Dev Page` },
  { path: "/download", component: AddToHomeScreenGuide, title: `${APP_NAME} | Thêm ứng dụng vào màn hình chính` },
  { path: "/clear", component: ClearDataPage, title: `${APP_NAME} | Clear Cache Website` },
  { path: "/pricing", component: PricingPage, title: `${APP_NAME} | Đăng ký gói thành viên` },
  { path: "/pricing/:planId", component: PlanDetailPage, title: `${APP_NAME} | Đăng ký gói thành viên` },
  { path: "/pay", component: PayPage, title: `${APP_NAME} | Thanh toán gói thành viên` },

  { path: "/locket", component: CameraCapture, title: `${APP_NAME} | Locket Camera` },
  { path: "/reference", component: ErrorReferencePage, title: `${APP_NAME} | Trung tâm lỗi & cách khắc phục` },
  { path: "/tools", component: ToolsLocket, title: `${APP_NAME} | Công cụ mở rộng` },
];

// 📌 Các route dành cho locket
const locketRoutes = [
  // { path: "/locket", component: CameraCapture, title: `${APP_NAME} | Locket Camera` },
  // { path: "/locket/profile", component: HomePages, title: `${APP_NAME} | Trang cá nhân Locket Camera` },
  // { path: "/locket/history", component: HistorysPage, title: `${APP_NAME} | Lịch sử Locket Camera` },
  // { path: "/locket/settings", component: SettingsPage, title: `${APP_NAME} | Cài đặt Locket Camera` },
];

export { publicRoutes, authRoutes, locketRoutes };
