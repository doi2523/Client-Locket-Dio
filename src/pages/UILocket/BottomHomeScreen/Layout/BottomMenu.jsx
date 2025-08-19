import { LayoutGrid, Trash2 } from "lucide-react";
import InputForMoment from "./InputForMoment";
import { useApp } from "@/context/AppContext";
import { showWarning, showSuccess } from "@/components/Toast";

const BottomMenu = () => {
  const { navigation, post } = useApp();
  const { isBottomOpen, setIsBottomOpen } = navigation;
  const {
    recentPosts,
    uploadPayloads,
    setuploadPayloads,
    selectedMoment,
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

  const handleDelete = () => {
    if (selectedMoment !== null) {
      showWarning("Đang phát triển!!!");
      return;
    }

    if (selectedQueue !== null) {
      const updatedPayloads = uploadPayloads.filter(
        (_, index) => index !== selectedQueue
      );

      setuploadPayloads(updatedPayloads);
      localStorage.setItem("uploadPayloads", JSON.stringify(updatedPayloads));

      setSelectedQueue(null);
      showSuccess("Đã xoá thành công!");
    }
  };

  return (
    <div className="w-full bottom-0 px-5 pb-5 text-base-content space-y-3">
      {/* Input chỉ hiện khi có selected */}
      {(typeof selectedMoment === "number" ||
        typeof selectedQueue === "number") && <InputForMoment />}

      {/* Menu dưới */}
      <div className="grid grid-cols-3 items-center">
        {/* Left: Close viewer button */}
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

        {/* Center: Home button */}
        <div className="flex justify-center scale-75 sm:scale-65">
          <button
            onClick={handleReturnHome}
            className="relative flex items-center justify-center w-20 h-20"
          >
            <div className="absolute w-20 h-20 border-4 border-base-content/30 rounded-full z-10"></div>
            <div className="absolute rounded-full w-16 h-16 bg-neutral z-0 hover:scale-105 transition-transform"></div>
          </button>
        </div>

        {/* Right: Delete button */}
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="p-2 backdrop-blur-xs bg-base-100/30 text-base-content tooltip-left tooltip cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
          >
            <Trash2 size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomMenu;
