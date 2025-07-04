import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { publicRoutes, authRoutes, locketRoutes } from "./routes";
import { AuthProvider, AuthContext } from "./context/AuthLocket";
import { ThemeProvider } from "./context/ThemeContext"; // 🟢 Import ThemeProvider
import { AppProvider } from "./context/AppContext";
import Loading from "./components/Loading";
import ToastProvider from "./components/Toast";
import NotFoundPage from "./components/404";
import getLayout from "./layouts";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          {" "}
          {/* 🟢 Thêm AppProvider ở đây */}
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

  useEffect(() => {
    const currentRoute = allRoutes.find(
      (route) => route.path === location.pathname
    );
    document.title = currentRoute ? currentRoute.title : "Ứng dụng của bạn";
  }, [location.pathname]);

  if (loading) return <Loading isLoading={true} />;

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.register('/service-worker.js').then(registration => {
  //     console.log('Service Worker đăng ký thành công: ', registration);
  //   }).catch(error => {
  //     console.log('Service Worker đăng ký thất bại: ', error);
  //   });
  // }

  return (
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
  );
}

export default App;
