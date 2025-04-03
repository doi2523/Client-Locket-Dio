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
import { showToast } from "./components/Toast";
import Loading from "./components/Loading";
import ToastProvider from "./components/Toast";
import NotFoundPage from "./components/404";
import getLayout from "./layouts";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const allRoutes = [...publicRoutes, ...authRoutes, ...locketRoutes];
    const currentRoute = allRoutes.find(
      (route) => route.path === location.pathname
    );
    document.title = currentRoute ? currentRoute.title : "Ứng dụng của bạn";
  }, [location.pathname]);

  if (loading) return <Loading isLoading={true} />;

  return (
    <Routes>
      {user
        ? authRoutes.map(({ path, component: Component }, index) => {
            const Layout = getLayout(path);
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            );
          })
        : publicRoutes.map(({ path, component: Component }, index) => {
            const Layout = getLayout(path);
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            );
          })}

      {!user &&
        authRoutes.map(({ path }, index) => (
          <Route key={index} path={path} element={<Navigate to="/login" />} />
        ))}

      {user &&
        publicRoutes.map(({ path }, index) => (
          <Route key={index} path={path} element={<Navigate to="/home" />} />
        ))}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


export default App;
