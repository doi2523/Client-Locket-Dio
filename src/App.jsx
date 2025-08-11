import React, { Suspense, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { publicRoutes, authRoutes, locketRoutes } from "./routes";
import { AuthProvider, AuthContext } from "./context/AuthLocket";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider } from "./context/AppContext";
import ToastProvider from "./components/Toast";
import getLayout from "./layouts";
import LoadingPage from "./components/pages/LoadingPage";
import NotFoundPage from "./components/pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
          <ToastProvider />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const allRoutes = [...publicRoutes, ...authRoutes, ...locketRoutes];
  const privateRoutes = [...authRoutes, ...locketRoutes];

  function setMeta(selector, content) {
    let el = document.querySelector(selector);
    if (el) el.setAttribute("content", content);
  }

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

  if (loading) return <LoadingPage isLoading={true} />;

  return (
    <Suspense fallback={<LoadingPage isLoading={true} />}>
      <Routes>
        {(user ? privateRoutes : publicRoutes).map(
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
        {!user &&
          privateRoutes.map(({ path }) => (
            <Route key={path} path={path} element={<Navigate to="/login" />} />
          ))}

        {/* Điều hướng ngược lại khi đã đăng nhập mà cố vào public route */}
        {user &&
          publicRoutes.map(({ path }) => (
            <Route key={path} path={path} element={<Navigate to="/locket" />} />
          ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
