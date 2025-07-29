import React from "react";

const Home = React.lazy(() => import("../pages/Public/Home"));
const Login = React.lazy(() => import("../pages/Public/Login"));
const AboutLocketDio = React.lazy(() => import("../pages/Public/About"));
const AboutMe = React.lazy(() => import("../pages/Auth/AboutMe"));
const Timeline = React.lazy(() => import("../pages/Public/Timeline"));
const Docs = React.lazy(() => import("../pages/Public/Docs"));
const CameraCapture = React.lazy(() => import("../pages/UILocket"));
const Contact = React.lazy(() => import("../pages/Public/Contact"));
const PrivacyPolicy = React.lazy(() => import("../pages/Public/PrivacyPolicy"));
const PricingPage = React.lazy(() => import("../pages/Public/Pricing"));
const ToolsLocket = React.lazy(() => import("../pages/Auth/LocketDioTools"));
const Settings = React.lazy(() => import("../pages/Public/Settings"));
const DevPage = React.lazy(() => import("../pages/Public/DevPage"));
const AddToHomeScreenGuide = React.lazy(() => import("../pages/Public/AddToScreen"));
const ClearDataPage = React.lazy(() => import("../pages/Public/ClearCache"));
const ErrorReferencePage = React.lazy(() => import("../pages/Public/ErrorReferencePage"));
const AuthHome = React.lazy(() => import("../pages/Auth/Home"));

const APP_NAME = "Locket Dio - Đăng ảnh & Video lên Locket";

export const publicRoutes = [
  { path: "/", component: Home, title: `Trang Chủ | ${APP_NAME}` },
  { path: "/login", component: Login, title: `Đăng Nhập | ${APP_NAME}` },
  { path: "/about", component: AboutLocketDio, title: `Về Website Locket Dio | ${APP_NAME}` },
  { path: "/about-dio", component: AboutMe, title: `Về Dio | ${APP_NAME}` },
  { path: "/timeline", component: Timeline, title: `Dòng Thời Gian | ${APP_NAME}` },
  { path: "/docs", component: Docs, title: `Tài liệu | ${APP_NAME}` },
  { path: "/locket", component: CameraCapture, title: `Locket Camera | ${APP_NAME}` },
  { path: "/contact", component: Contact, title: `Liên hệ | ${APP_NAME}` },
  { path: "/privacy", component: PrivacyPolicy, title: `Chính sách riêng tư | ${APP_NAME}` },
  { path: "/pricing", component: PricingPage, title: `Đăng ký gói thành viên | ${APP_NAME}` },
  { path: "/locketdio-tools", component: ToolsLocket, title: `Công cụ mở rộng | ${APP_NAME}` },
  { path: "/settings", component: Settings, title: `Cài đặt | ${APP_NAME}` },
  { path: "/devpage", component: DevPage, title: `Dev Page | ${APP_NAME}` },
  { path: "/download", component: AddToHomeScreenGuide, title: `Thêm ứng dụng vào màn hình chính | ${APP_NAME}` },
  { path: "/clear", component: ClearDataPage, title: `Clear Cache Website | ${APP_NAME}` },
  { path: "/reference", component: ErrorReferencePage, title: `Trung tâm lỗi | ${APP_NAME}` },
  { path: "/test", component: AuthHome, title: `Test | ${APP_NAME}` },
];
