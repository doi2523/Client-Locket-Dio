import { CalendarHeart, LayoutGrid, Share } from "lucide-react";
import InputForMoment from "./InputForMoment";
import { useApp } from "@/context/AppContext";
import { SonnerInfo } from "@/components/ui/SonnerToast";

const BottomMenu = ({ setIsBottomOpen, setOptionModalOpen }) => {
  const { navigation, post } = useApp();
  const {
    recentPosts,
    uploadPayloads,
    setuploadPayloads,
    selectedMoment,
    selectedMomentId,
    setSelectedMoment,
    selectedQueue,
    setSelectedQueue,
  } = post;

  const handleReturnHome = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
    setIsBottomOpen(false);
  };
  const handleClose = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
  };

  return (
    <>
      <div className="fixed z-70 w-full bottom-0 px-5 pb-5 text-base-content space-y-3">
        {typeof selectedMoment === "number" && <InputForMoment />}

        <div className="grid grid-cols-3 items-center">
          <div className="flex justify-start">
            {selectedMoment !== null && (
              <button
                className="p-2 text-base-content cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
                onClick={handleClose}
              >
                <LayoutGrid size={28} />
              </button>
            )}
          </div>

          <div className="flex justify-center scale-75 sm:scale-65">
            <button
              onClick={handleReturnHome}
              className="relative flex items-center justify-center w-20 h-20"
            >
              <div className="absolute w-20 h-20 border-4 border-base-content/30 rounded-full z-10"></div>
              <div className="absolute rounded-full w-16 h-16 bg-base-content z-0 hover:scale-105 transition-transform"></div>
            </button>
          </div>

          <div className="flex justify-end">
            {(selectedMoment !== null || selectedQueue !== null) && (
              <button
                onClick={() => setOptionModalOpen(true)}
                className="btn btn-circle btn-lg p-2 backdrop-blur-xs bg-base-100/30 text-base-content cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
              >
                <Share size={28} />
              </button>
            )}
            {/* CALENDAR – mặc định hiện, ẩn khi có selection */}
            {selectedMoment === null && selectedQueue === null && (
              <button
                onClick={() => SonnerInfo("Chức năng này đang phát triển!")}
                className="btn btn-circle btn-lg backdrop-blur-xs bg-base-100/30 text-base-content cursor-pointer hover:bg-base-200/50 transition-colors"
              >
                <CalendarHeart size={28} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomMenu;
