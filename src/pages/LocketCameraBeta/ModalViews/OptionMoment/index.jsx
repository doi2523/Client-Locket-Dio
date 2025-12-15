import React, { useState, useEffect } from "react";
import { DeleteMoment } from "@/services/LocketDioServices/ActionMoments";
import { Download, Trash2, X } from "lucide-react";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge";
import { useApp } from "@/context/AppContext";
import { SonnerSuccess, SonnerWarning } from "@/components/ui/SonnerToast";
import Modal from "@/components/ui/Modal";
import { useMoments } from "@/hooks/useMoments";
import { deletePayloadById } from "@/process/uploadQueue";

const OptionMoment = ({ setOptionModalOpen, isOptionModalOpen }) => {
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
  const [openModal, setOpenModal] = useState(false);

  const { removeMoment } = useMoments();

  // Lock scroll khi mở modal
  useEffect(() => {
    document.body.style.overflow = isOptionModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOptionModalOpen]);

  const handleDelete = async () => {
    if (selectedMomentId !== null) {
      try {
        const deletedMoment = await DeleteMoment(selectedMomentId);
        if (deletedMoment === selectedMomentId) {
          await removeMoment(selectedMomentId);
          SonnerSuccess(
            "Đã xoá ảnh thành công!",
            "Vui lòng làm mới để cập nhật."
          );
          handleClose();
        } else {
          SonnerWarning("Xoá không thành công, vui lòng thử lại!");
        }
      } catch (error) {
        SonnerWarning("Xoá không thành công, vui lòng thử lại!");
      }
      return;
    }

    if (selectedQueue !== null) {
      const updatedPayloads = uploadPayloads.filter(
        (_, index) => index !== selectedQueue
      );
      await deletePayloadById(selectedQueue);
      setuploadPayloads(updatedPayloads);

      setSelectedQueue(null);
      showSuccess("Đã xoá thành công!");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62] ${
          isOptionModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOptionModalOpen(false)}
      />

      <div
        className={`fixed border-t border-base-content bottom-0 left-0 w-full pt-3 pb-5 px-4 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content ${
          isOptionModalOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center rounded-t-4xl">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-lovehouse mt-1.5 font-semibold">
              Option Moment
            </div>
            <PlanBadge />
          </div>
          <button
            onClick={() => setOptionModalOpen(false)}
            className="btn btn-circle cursor-pointer hover:bg-base-200 p-1"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-left text-sm mt-4 text-base-content/70">
          Bạn có thể tải về hình ảnh/video của bạn bè hoặc xoá chúng khỏi lịch
          sử của bạn {selectedQueue}
        </p>
        <div className="w-full flex flex-row justify-center items-center gap-3 mt-6">
          <button className="btn btn-neutral btn-outline rounded-3xl w-36 flex items-center justify-center gap-2">
            <Download size={24} /> Tải xuống
          </button>

          <button
            onClick={() => {
              setOptionModalOpen(false);
              setOpenModal(true);
            }}
            className="btn btn-neutral btn-outline rounded-3xl w-36 flex items-center justify-center gap-2"
          >
            <Trash2 size={24} /> Xoá
          </button>
        </div>
      </div>

      {/* Modal xoá giữ nguyên */}
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
    </>
  );
};

export default OptionMoment;
