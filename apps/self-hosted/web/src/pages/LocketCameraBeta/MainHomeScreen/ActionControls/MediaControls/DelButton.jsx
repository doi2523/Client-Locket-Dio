import { X } from "lucide-react";
import { useApp } from "@/context/AppContext.jsx";
import { useCallback, useState } from "react";
import { defaultPostOverlay } from "@/stores/usePost.js";

const DelButton = () => {
  const { navigation, post, useloading, camera } = useApp();
  const { setIsFilterOpen } = navigation;
  const { sendLoading, uploadLoading, setUploadLoading } = useloading;
  const {
    preview,
    setPreview,
    selectedFile,
    setSelectedFile,
    isSizeMedia,
    setSizeMedia,
    postOverlay,
    setPostOverlay,
    audience,
    setAudience,
    selectedRecipients,
    setSelectedRecipients,
  } = post;
  const { setCameraActive } = camera;

  const handleDelete = useCallback(() => {
    // Dừng stream cũ nếu có
    if (camera.streamRef.current) {
      camera.streamRef.current.getTracks().forEach((track) => track.stop());
      camera.streamRef.current = null;
    }
    setSelectedFile(null);
    setPreview(null);
    setSizeMedia(null);
    setPostOverlay(defaultPostOverlay);
    setAudience("all");
    setCameraActive(true); // Giữ dòng này để trigger useEffect
  }, []);

  return (
    <>
      <button
        className="cursor-pointer active:scale-95"
        onClick={handleDelete}
        disabled={sendLoading || uploadLoading}
      >
        <X size={35} />
      </button>
    </>
  );
};

export default DelButton;
