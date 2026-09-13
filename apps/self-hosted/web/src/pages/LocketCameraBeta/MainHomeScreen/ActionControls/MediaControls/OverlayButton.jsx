import { Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext.jsx";

const OverlayButton = () => {
  const { navigation, post, useloading, camera } = useApp();
  const { setIsFilterOpen } = navigation;
  const { sendLoading, uploadLoading, setUploadLoading } = useloading;

  return (
    <>
      <button
        className="cursor-pointer active:scale-95"
        onClick={() => {
          setIsFilterOpen(true);
        }}
        disabled={uploadLoading}
      >
        <Sparkles size={35} />
      </button>
    </>
  );
};

export default OverlayButton;
