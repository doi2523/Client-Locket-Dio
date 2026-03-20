import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FloatingActions = lazy(() => import("@/components/ui/FloatingWidget"));
const CropImageStudio = lazy(
  () => import("@/components/common/CropImageStudio"),
);

const DefaultLayout = ({ children }) => {
  const location = useLocation();

  // Ẩn floating
  const hiddenFloatingRoutes = ["/tools"];
  const shouldHideFloating = hiddenFloatingRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  // Chỉ hiện crop ở các route này
  const cropRoutes = ["/postmoments", "/restore-streak"];
  const shouldShowCrop = cropRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      <Header />
      <div className="h-16 bg-base-200" />
      <main className="overflow-hidden bg-base-200 text-base-content relative">
        <div className="relative z-10">{children}</div>
      </main>

      {!shouldHideFloating && <Footer />}

      <Suspense fallback={null}>
        {shouldShowCrop && <CropImageStudio />}
        {!shouldHideFloating && <FloatingActions />}
      </Suspense>
    </>
  );

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <Header />

      <main className="overflow-hidden bg-base-200 text-base-content relative">
        <div className="relative z-10">{children}</div>
      </main>

      {!shouldHideFloating && <Footer />}

      <Suspense fallback={null}>
        {shouldShowCrop && <CropImageStudio />}
        {!shouldHideFloating && <FloatingActions />}
      </Suspense>
    </div>
  );
};

export default DefaultLayout;
