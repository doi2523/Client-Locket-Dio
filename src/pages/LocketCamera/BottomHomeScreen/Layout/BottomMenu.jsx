import { LayoutGrid, Trash2 } from "lucide-react";
import InputForMoment from "./InputForMoment";
import { useApp } from "@/context/AppContext";
import { showWarning, showSuccess } from "@/components/Toast";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { DeleteMoment } from "@/services";
import { SonnerSuccess } from "@/components/ui/SonnerToast";
import { useMoments } from "@/hooks/useMoments";

const BottomMenu = () => {
  const { navigation, post } = useApp();
  const { isBottomOpen, setIsBottomOpen } = navigation;
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
  const [openModal, setOpenModal] = useState(false);

  const { removeMoment } = useMoments();

  const handleReturnHome = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
    setIsBottomOpen(false);
  };
  const handleClose = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
  };

  const handleDelete = async () => {
    if (selectedMomentId !== null) {
      try {
        const deletedMoment = await DeleteMoment(selectedMomentId);
        if (deletedMoment === selectedMomentId) {
          await removeMoment(selectedMomentId);
          SonnerSuccess("Đã xoá ảnh thành công!","Vui lòng làm mới để cập nhật.");
          handleClose();
        } else {
          showWarning("Xoá không thành công, vui lòng thử lại!");
        }
      } catch (error) {
        showWarning("Xoá không thành công, vui lòng thử lại!");
      }
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
            onClick={() => setOpenModal(true)}
            className="p-2 backdrop-blur-xs bg-base-100/30 text-base-content tooltip-left tooltip cursor-pointer hover:bg-base-200/50 rounded-full transition-colors"
          >
            <Trash2 size={28} />
          </button>
        </div>

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Xoá ảnh?"
          actions={
            <>
              <button
                onClick={() => setOpenModal(false)}
                className="btn btn-soft px-4 py-2 rounded-xl transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setOpenModal(false);
                }}
                className="btn btn-error px-4 py-2 rounded-xl transition-colors"
              >
                Xoá
              </button>
            </>
          }
        >
          Việc này sẽ xoá ảnh khỏi lịch sử của bạn và không thể hoàn tác.
        </Modal>
      </div>
    </div>
  );
};

export default BottomMenu;
