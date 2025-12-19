import React from "react";
// const CameraCapture = React.lazy(() => import("../pages/UILocket"));
import Home from "../pages/Public/Home";
import Login from "../pages/Public/Login";
import { CONFIG } from "@/config";
const LocketCameraBeta = React.lazy(() => import("../pages/LocketCameraBeta"));
// import CameraCapture from "@/pages/UILocket";
// const WhitePage = React.lazy(() => import("@/pages/Public/WhitePage"));
const NewsPage = React.lazy(() => import("@/pages/Public/NewsPage"));
const NewsDetailPage = React.lazy(() => import("@/pages/Public/NewsDetailPage"));
const ForgotPassword = React.lazy(() => import("@/pages/Public/ForgotPassword"));
const DonatePage = React.lazy(() => import("@/pages/Public/Sponsors"));
const AboutLocketDio = React.lazy(() => import("../pages/Public/About"));
const AboutMe = React.lazy(() => import("../pages/Auth/AboutMe"));
const Timeline = React.lazy(() => import("../pages/Public/Timeline"));
const Docs = React.lazy(() => import("../pages/Public/Docs"));
const CollectionPage = React.lazy(() => import("@/pages/Public/CollectionPage"));
const Contact = React.lazy(() => import("../pages/Public/Contact"));
const PrivacyPolicy = React.lazy(() => import("../pages/Public/PrivacyPolicy"));
const PricingPage = React.lazy(() => import("../pages/Public/Pricing"));
const PlanDetailPage = React.lazy(() => import("../pages/Auth/PricingDetail"));
const ToolsLocket = React.lazy(() => import("../pages/Auth/LocketDioTools"));
const Settings = React.lazy(() => import("../pages/Public/Settings"));
const DevPage = React.lazy(() => import("../pages/Public/DevPage"));
const AddToHomeScreenGuide = React.lazy(() => import("../pages/Public/AddToScreen"));
const ErrorReferencePage = React.lazy(() => import("../pages/Public/ErrorReferencePage"));
const ReferencePage = React.lazy(() => import("../pages/Public/APIDocs"));
const BirthdayPage = React.lazy(() => import("../pages/Public/BirthdayPage"));

const APP_NAME = CONFIG.app.fullName;

export const publicRoutes = [
  { path: "/", component: Home, title: `Trang Chủ | ${APP_NAME}` },
  { path: "/login", component: Login, title: `Đăng Nhập | ${APP_NAME}` },

  { path: "/about", component: AboutLocketDio, title: `Về Website Locket Dio | ${APP_NAME}` },
  { path: "/about-dio", component: AboutMe, title: `Về Dio | ${APP_NAME}` },

  { path: "/newsfeed", component: NewsPage, title: `Bảng tin | ${APP_NAME}` },
  { path: "/newsfeed/:slug", component: NewsDetailPage, title: `Bảng tin | ${APP_NAME}` },
  
  { path: "/download", component: AddToHomeScreenGuide, title: `Thêm ứng dụng vào màn hình chính | ${APP_NAME}` },
  { path: "/timeline", component: Timeline, title: `Dòng Thời Gian | ${APP_NAME}` },

  { path: "/docs", component: Docs, title: `Tài liệu | ${APP_NAME}` },
  { path: "/sponsors", component: DonatePage, title: `Ủng hộ dự án | ${APP_NAME}` },
  { path: "/collection", component: CollectionPage, title: `Thư viện phiên bản | ${APP_NAME}` },
  { path: "/locket-beta", component: LocketCameraBeta, title: `Locket Camera | ${APP_NAME}` },

  { path: "/privacy", component: PrivacyPolicy, title: `Chính sách riêng tư | ${APP_NAME}` },
  { path: "/pricing", component: PricingPage, title: `Đăng ký gói thành viên | ${APP_NAME}` },
  { path: "/pricing/:planId", component: PlanDetailPage, title: `Chi tiết gói | ${APP_NAME}` },
  { path: "/locketdio-tools", component: ToolsLocket, title: `Công cụ mở rộng | ${APP_NAME}` },

  { path: "/settings", component: Settings, title: `Cài đặt | ${APP_NAME}` },
  { path: "/devpage", component: DevPage, title: `Dev Page | ${APP_NAME}` },
  { path: "/reference", component: ReferencePage, title: `API Docs | ${APP_NAME}` },
  { path: "/incidents", component: ErrorReferencePage, title: `Trung tâm sự cố | ${APP_NAME}` },
  { path: "/contact", component: Contact, title: `Liên hệ & Hỗ trợ | ${APP_NAME}` },

  { path: "/happy-birthday", component: BirthdayPage, title: `Chúc mừng sinh nhật Dio | ${APP_NAME}` },

  // { path: "/wt", component: WhitePage, title: `White Page for Development | ${APP_NAME}` },
  // { path: "/locket", component: LocketCameraBeta, title: `White Page for Development | ${APP_NAME}` },

  { path: "/forgot-password", component: ForgotPassword, title: `Khôi phục mật khẩu | ${APP_NAME}` },
];
