import Login1 from "../hooks/TestLogin";
import Upload from "../hooks/UploadPost";
import AuthHome from "../pages/Auth/Home";
import Post from "../pages/Auth/PostImage";
import PostVideo from "../pages/Auth/PostVideo";
import Profile from "../pages/Auth/Profile";
import Home from "../pages/Public/Home";
import Login from "../pages/Public/Login";
import Timeline from "../pages/Public/Timeline";
import UploadForm from "../pages/Test";
import CameraCapture from "../pages/UILocket/Home";

const APP_NAME = "💛Locket Pro - Đăng ảnh & Video lên Locket";

// 📌 Các route dành cho người chưa đăng nhập
const publicRoutes = [
  { path: "/", component: Home, title: `${APP_NAME} | Trang Chủ` },
  { path: "/test", component: CameraCapture, title: `${APP_NAME} | Test` },
  { path: "/login", component: Login, title: `${APP_NAME} | Đăng Nhập` },
  { path: "/testv1", component: UploadForm, title: `${APP_NAME} | Test` },
];

// 📌 Các route yêu cầu đăng nhập
const authRoutes = [
  { path: "/home", component: AuthHome, title: `${APP_NAME} | Trang chủ` },
  { path: "/profile", component: Profile, title: `${APP_NAME} | Hồ sơ` },
  { path: "/post", component: Post, title: `${APP_NAME} | Đăng Ảnh Mới` },
  { path: "/postvideo", component: PostVideo, title: `${APP_NAME} | Đăng Video Mới` },
  { path: "/test", component: CameraCapture, title: `${APP_NAME} | Đăng Video Mới` },
  { path: "/timeline", component: Timeline, title: `${APP_NAME} | Dòng Thời Gian` },

  { path: "/locket", component: CameraCapture, title: `${APP_NAME} | Trang Chủ` },
];

// 📌 Các route dành cho locket
const locketRoutes = [
  { path: "/test", component: CameraCapture, title: `${APP_NAME} | Trang chủ` },
];

export { publicRoutes, authRoutes, locketRoutes };
