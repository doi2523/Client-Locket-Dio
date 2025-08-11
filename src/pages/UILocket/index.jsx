import React, { lazy, Suspense } from "react";
import LoadingPage from "@/components/pages/LoadingPage.jsx";
import MainHomeScreen from "./MainHomeScreen";

// Lazy load các phần nặng
const LeftHomeScreen = lazy(() => import("./LeftHomeScreen"));
const RightHomeScreen = lazy(() => import("./RightHomeScreen"));
const BottomHomeScreen = lazy(() => import("./BottomHomeScreen"));
const CropImageStudio = lazy(() =>
  import("@/components/common/CropImageStudio.jsx")
);

const CameraCapture = () => {
  return (
    <Suspense fallback={<LoadingPage isLoading={true}/>}>
      {/* Component không lazy vẫn load bình thường */}
      <MainHomeScreen />
      <LeftHomeScreen />
      <RightHomeScreen />
      <BottomHomeScreen />
      <CropImageStudio />
    </Suspense>
  );
};

export default CameraCapture;
