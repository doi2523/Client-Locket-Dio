import React, { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// const Sidebar = lazy(() => import("@/components/Sidebar"));
import LoadingPage from "../components/pages/LoadingPage";
import Sidebar from "@/components/Sidebar";
import ContactSupportButton from "@/components/ui/ContactSupportButton";
const CropImageStudio = lazy(() => import("@/components/common/CropImageStudio.jsx"));

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      {/* Fixed Header */}
      <Header />
      {isLoading && (
        <div className="absolute inset-0 z-20">
          <LoadingPage />
        </div>
      )}
      {/* Main Content with Scroll */}
      <main className="overflow-hidden bg-base-200 text-base-content relative">
        <div className="relative z-10">{children}</div>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CropImageStudio />
      </Suspense>
      <Sidebar />
      <ContactSupportButton/>
    </div>
  );
};

export default DefaultLayout;
