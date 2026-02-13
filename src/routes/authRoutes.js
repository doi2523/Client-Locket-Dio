import { CONFIG } from "@/config";
import React from "react";
// import CameraCapture from "../pages/UILocket";
const DiaryPage = React.lazy(() => import("@/pages/Auth/DiaryPage"));
const AboutLocketDio = React.lazy(() => import("../pages/Public/About"));
const RestoreStreak = React.lazy(() => import("@/pages/Auth/RestoreStreak"));
const NewsPage = React.lazy(() => import("@/pages/Public/NewsPage"));
const NewsDetailPage = React.lazy(() => import("@/pages/Public/NewsDetailPage"));
const AuthHome = React.lazy(() => import("../pages/Auth/Home"));
const Profile = React.lazy(() => import("../pages/Auth/Profile"));
const DonatePage = React.lazy(() => import("@/pages/Public/Sponsors"));
const PostMoments = React.lazy(() => import("../pages/Auth/PostMoments"));
const AboutMe = React.lazy(() => import("../pages/Auth/AboutMe"));
const Docs = React.lazy(() => import("../pages/Public/Docs"));
const Settings = React.lazy(() => import("../pages/Public/Settings"));
const DevPage = React.lazy(() => import("../pages/Public/DevPage"));
const AddToHomeScreenGuide = React.lazy(() => import("../pages/Public/AddToScreen"));
const PricingPage = React.lazy(() => import("../pages/Public/Pricing"));
const PlanDetailPage = React.lazy(() => import("../pages/Auth/PricingDetail"));
const PayPage = React.lazy(() => import("../pages/Auth/PayPage"));
const Timeline = React.lazy(() => import("../pages/Public/Timeline"));
const ToolsLocket = React.lazy(() => import("../pages/Auth/LocketDioTools"));
const ManageCaption = React.lazy(() => import("@/pages/Public/CollabPage/CaptionKanade"));
const ErrorReferencePage = React.lazy(() => import("../pages/Public/ErrorReferencePage"));
const Contact = React.lazy(() => import("../pages/Public/Contact"));
const PrivacyPolicy = React.lazy(() => import("../pages/Public/PrivacyPolicy"));
const BirthdayPage = React.lazy(() => import("../pages/Public/BirthdayPage"));
const LocketUpload = React.lazy(() => import("@/pages/Public/CollabPage/LocketUpload"));
const LocketGold = React.lazy(() => import("@/pages/Public/CollabPage/LocketGold"));

const APP_NAME = CONFIG.app.fullName;

export const authRoutes = [
  { path: "/home", component: AuthHome, title: `Trang chủ | ${APP_NAME}` },
  { path: "/about", component: AboutLocketDio, title: `Về Website Locket Dio | ${APP_NAME}` },
  { path: "/about-dio", component: AboutMe, title: `Về Dio | ${APP_NAME}` },
  { path: "/timeline", component: Timeline, title: `Dòng Thời Gian | ${APP_NAME}` },
  { path: "/sponsors", component: DonatePage, title: `Ủng hộ dự án | ${APP_NAME}` },

  { path: "/newsfeed", component: NewsPage, title: `Bảng tin | ${APP_NAME}` },
  { path: "/newsfeed/:slug", component: NewsDetailPage, title: `Bảng tin | ${APP_NAME}` },

  { path: "/download", component: AddToHomeScreenGuide, title: `Thêm ứng dụng vào màn hình chính | ${APP_NAME}` },

  { path: "/pricing", component: PricingPage, title: `Bảng giá & Gói dịch vụ | ${APP_NAME}` },
  { path: "/pricing/:planId", component: PlanDetailPage, title: `Chi tiết gói | ${APP_NAME}` },
  { path: "/pay", component: PayPage, title: `Thanh toán | ${APP_NAME}` },

  { path: "/profile", component: Profile, title: `Hồ sơ | ${APP_NAME}` },
  { path: "/postmoments", component: PostMoments, title: `Đăng Moment Mới | ${APP_NAME}` },
  { path: "/restore-streak", component: RestoreStreak, title: `Khôi phục chuỗi Locket | ${APP_NAME}` },
  { path: "/tools", component: ToolsLocket, title: `Công cụ mở rộng | ${APP_NAME}` },
  { path: "/collab/caption-kanade", component: ManageCaption, title: `Web hợp tác Caption Kanade | ${APP_NAME}` },
  { path: "/collab/locket-upload", component: LocketUpload, title: `Web hợp tác Locket Upload | ${APP_NAME}` },
  { path: "/collab/locket-gold", component: LocketGold, title: `Web hợp tác LocketGold.click | ${APP_NAME}` },
  { path: "/diary", component: DiaryPage, title: `Nhật ký Locket | ${APP_NAME}` },

  { path: "/settings", component: Settings, title: `Cài đặt | ${APP_NAME}` },
  { path: "/devpage", component: DevPage, title: `Dev Page | ${APP_NAME}` },
  { path: "/contact", component: Contact, title: `Liên hệ & Hỗ trợ | ${APP_NAME}` },
  { path: "/incidents", component: ErrorReferencePage, title: `Trung tâm sự cố | ${APP_NAME}` },
  { path: "/privacy", component: PrivacyPolicy, title: `Chính sách bảo mật | ${APP_NAME}` },
  { path: "/docs", component: Docs, title: `Tài liệu | ${APP_NAME}` },

  { path: "/happy-birthday", component: BirthdayPage, title: `Chúc mừng sinh nhật Dio | ${APP_NAME}` },
];
