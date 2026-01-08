import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { publicRoutes, authRoutes, locketRoutes } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import ToastProvider from "./components/Toast";
import getLayout from "./layouts";
import NotFoundPage from "./components/pages/NotFoundPage";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/SocketContext";
import {
  useAuthStore,
  useFriendStoreV2,
  useStreakStore,
  useUploadQueueStore,
} from "./stores";
import { showDevWarning } from "./utils/logging/devConsole";
import LoadingPageMain from "./components/pages/LoadPageMain";
import { useOverlayStore } from "./stores/useOverlayStore";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
          <ToastProvider />
          <Toaster />
        </AppProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { loading, isAuth, user, hydrate, init } = useAuthStore();
  const syncStreak = useStreakStore((s) => s.syncStreak);
  const fetchCaptionOverlays = useOverlayStore((s) => s.fetchCaptionOverlays);
  const hydrateUploadQueue = useUploadQueueStore((s) => s.hydrateUploadQueue);
  const loadFriendsV2 = useFriendStoreV2((s) => s.loadFriends);

  const location = useLocation();

  const allRoutes = [...publicRoutes, ...authRoutes, ...locketRoutes];
  const privateRoutes = [...authRoutes, ...locketRoutes];

  function setMeta(selector, content) {
    let el = document.querySelector(selector);
    if (el) el.setAttribute("content", content);
  }
  useEffect(() => {
    import("./styles/animation.css");
    hydrate();
    init();
    showDevWarning();
    fetchCaptionOverlays();
  }, []);

  useEffect(() => {
    if (!loading && isAuth && location.pathname === "/login") {
      navigate("/locket-beta", { replace: true });
    }
  }, [isAuth, loading, location.pathname]);

  useEffect(() => {
    if (user) {
      loadFriendsV2();
      syncStreak();
      hydrateUploadQueue();
    }
  }, [user]);

  useEffect(() => {
    const r = allRoutes.find((route) => route.path === location.pathname);
    document.title = r?.title || "Locket Dio - Đăng ảnh & Video lên Locket";

    const url = "https://locket-dio.com" + location.pathname;
    (
      document.querySelector("link[rel='canonical']") ||
      document.head.appendChild(
        Object.assign(document.createElement("link"), { rel: "canonical" })
      )
    ).href = url;

    setMeta("meta[property='og:title']", document.title);
    setMeta("meta[property='og:url']", url);
    setMeta("meta[name='twitter:title']", document.title);
  }, [location.pathname]);

  if (loading) return <LoadingPageMain isLoading={true} />;

  return (
    <Suspense fallback={<LoadingPageMain isLoading={true} />}>
      <Routes>
        {(isAuth ? privateRoutes : publicRoutes).map(
          ({ path, component: Component }) => {
            const Layout = getLayout(path);
            return (
              <Route
                key={path}
                path={path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            );
          }
        )}

        {/* Điều hướng khi chưa đăng nhập cố vào route cần auth */}
        {!isAuth &&
          privateRoutes.map(({ path }) => (
            <Route key={path} path={path} element={<Navigate to="/login" />} />
          ))}

        {/* Điều hướng ngược lại khi đã đăng nhập mà cố vào public route */}
        {isAuth &&
          publicRoutes.map(({ path }) => (
            <Route
              key={path}
              path={path}
              element={<Navigate to="/locket-beta" />}
            />
          ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
