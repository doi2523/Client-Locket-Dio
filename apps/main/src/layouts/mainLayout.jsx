import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const FloatingActions = lazy(() => import("@/components/ui/FloatingWidget"));
const CropImageStudio = lazy(() =>
  import("@/components/common/CropImageStudio")
);

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  // Các route cần ẩn FloatingActions
  const hiddenFloatingRoutes = ["/tools"];
  const shouldHideFloating = hiddenFloatingRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      {/* Fixed Header */}
      <Header />

      {/* Main Content with Scroll */}
      <main className="overflow-hidden bg-base-200 text-base-content relative">
        <div className="relative z-10">{children}</div>
      </main>

      {!shouldHideFloating && <Footer />}

      <Suspense fallback={null}>
        <CropImageStudio />
        {!shouldHideFloating && <FloatingActions />}
      </Suspense>

      <Sidebar />
    </div>
  );
};

export default DefaultLayout;
