import React from "react";

// React.lazy: Tự động tách JS thành từng file nhỏ khi dùng
const AboutMe = React.lazy(() => import("../pages/Auth/AboutMe"));
const AuthHome = React.lazy(() => import("../pages/Auth/Home"));
const ToolsLocket = React.lazy(() => import("../pages/Auth/LocketDioTools"));
const PostMoments = React.lazy(() => import("../pages/Auth/PostMoments"));
const Profile = React.lazy(() => import("../pages/Auth/Profile"));
const AboutLocketDio = React.lazy(() => import("../pages/Public/About"));
const AddToHomeScreenGuide = React.lazy(() => import("../pages/Public/AddToScreen"));
const ClearDataPage = React.lazy(() => import("../pages/Public/ClearCache"));
const Contact = React.lazy(() => import("../pages/Public/Contact"));
const DevPage = React.lazy(() => import("../pages/Public/DevPage"));
const Docs = React.lazy(() => import("../pages/Public/Docs"));
const ErrorReferencePage = React.lazy(() => import("../pages/Public/ErrorReferencePage"));
const DonateHistory = React.lazy(() => import("../pages/Public/HistoryDonate"));
const Home = React.lazy(() => import("../pages/Public/Home"));
const Login = React.lazy(() => import("../pages/Public/Login"));
const PayPage = React.lazy(() => import("../pages/Public/PayPage"));
const PricingPage = React.lazy(() => import("../pages/Public/Pricing"));
const PlanDetailPage = React.lazy(() => import("../pages/Public/PricingDetail"));
const PrivacyPolicy = React.lazy(() => import("../pages/Public/PrivacyPolicy"));
const Settings = React.lazy(() => import("../pages/Public/Settings"));
const Timeline = React.lazy(() => import("../pages/Public/Timeline"));
const CameraCapture = React.lazy(() => import("../pages/UILocket"));
const HistorysPage = React.lazy(() => import("../pages/UILocket/ExtendPage/pages/HistorysPage"));
const MainHomePage = React.lazy(() => import("../pages/UILocket/ExtendPage/pages/MainHomePage"));
const HomePages = React.lazy(() => import("../pages/UILocket/ExtendPage/pages/ProfilePage"));
const SettingsPage = React.lazy(() => import("../pages/UILocket/ExtendPage/pages/SettingsPage"));

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
