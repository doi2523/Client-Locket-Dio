import React, { useState, useEffect } from "react";
import { Download, Repeat, Share, Trash2, X } from "lucide-react";
import PlanBadge from "@/components/ui/PlanBadge/PlanBadge";
import { useApp } from "@/context/AppContext";
import {
  SonnerSuccess,
  SonnerWarning,
  SonnerInfo,
} from "@/components/ui/SonnerToast";
import Modal from "@/components/ui/Modal";
import { DeleteMoment, downloadAndShareFile } from "@/services";
import { getMomentById } from "@/cache/momentDB";
import { useMomentsStoreV2, useUploadQueueStore } from "@/stores";
import { getUploadItemFromDB } from "@/cache/uploadMomentDB";

const OptionMoment = ({ setOptionModalOpen, isOptionModalOpen }) => {
  const { post } = useApp();
  const {
    selectedMomentId,
    setSelectedMomentId,
    setSelectedMoment,
    selectedQueue,
    selectedQueueId,
    setSelectedQueueId,
    setSelectedQueue,
    selectedFriendUid,
  } = post;
  const [openModal, setOpenModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const { removeMoment } = useMomentsStoreV2();

  const { removeUploadItemById } = useUploadQueueStore();
  // Lock scroll khi mở modal
  useEffect(() => {
    document.body.style.overflow = isOptionModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOptionModalOpen]);

  const handleClose = () => {
    setSelectedMoment(null);
    setSelectedQueue(null);
    setSelectedQueueId(null);
    setSelectedMomentId(null);
  };

  const handleDelete = async () => {
    if (selectedMomentId !== null) {
      try {
        //Call API xoá ảnh
        const deletedMoment = await DeleteMoment(selectedMomentId);
        if (deletedMoment === selectedMomentId) {
          //Xoá ảnh trong local nếu id đã xoá trùng id chọn
          await removeMoment(selectedMomentId, selectedFriendUid);
          SonnerSuccess("Đã xoá ảnh thành công!");
          handleClose();
        } else {
          SonnerWarning("Xoá không thành công, vui lòng thử lại!");
        }
      } catch (error) {
        SonnerWarning("Xoá không thành công, vui lòng thử lại!");
        console.warn("❌ Failed", error);
      }
      return;
    }

    if (selectedQueueId !== null) {
      await removeUploadItemById(selectedQueueId);
      SonnerSuccess("Đã xoá khỏi hàng chờ!");
      handleClose();
    }
  };

  const getMediaInfo = async () => {
    if (selectedQueueId !== null) {
      const data = await getUploadItemFromDB(selectedQueueId);
      if (!data) return null;

      const { url, type } = data.mediaInfo || {};
      if (!url) return null;

      return {
        url,
        filename: `moment_${selectedQueueId}.${type === "video" ? "mp4" : "jpg"}`,
      };
    }

    if (selectedMomentId !== null) {
      const data = await getMomentById(selectedMomentId);
      if (!data) return null;

      if (data.videoUrl) {
        return {
          url: data.videoUrl,
          filename: `moment_${selectedMomentId}.mp4`,
        };
      }

      if (data.thumbnailUrl) {
        return {
          url: data.thumbnailUrl,
          filename: `moment_${selectedMomentId}.jpg`,
        };
      }
    }

    return null;
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    SonnerInfo("Đang chuẩn bị tải xuống...");

    try {
      const media = await getMediaInfo();
      if (!media) {
        SonnerInfo("Không có video hoặc thumbnail để tải");
        return;
      }

      await downloadAndShareFile(media.url, media.filename, () =>
        setDownloading(false),
      );
    } catch (err) {
      SonnerWarning(
        "Phương tiện không tồn tại hoặc đã huỷ quá trình tải xuống.",
      );
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleSharing = async () => {
    if (sharing) return;
    setSharing(true);
    SonnerInfo("Đang chuẩn bị chia sẻ...");

    try {
      const media = await getMediaInfo();
      if (!media) {
        SonnerInfo("Không có video hoặc thumbnail để tải");
        return;
      }

      await downloadAndShareFile(media.url, media.filename, () =>
        setSharing(false),
      );
    } catch (err) {
      SonnerWarning("Phương tiện không tồn tại hoặc đã huỷ quá trình chia sẻ.");
      console.error(err);
    } finally {
      setSharing(false);
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
        className={`fixed border-t border-base-content bottom-0 left-0 w-full pt-3 pb-6 px-4 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content ${
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
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn btn-neutral rounded-3xl flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Đang tải...
              </>
            ) : (
              <>
                <Download size={20} /> Tải xuống
              </>
            )}
          </button>

          <button
            onClick={() => SonnerInfo("Chức năng này sẽ sớm có mặt!")}
            className="btn btn-secondary rounded-3xl w-full flex items-center justify-center gap-2"
          >
            {/* Icon repost */}
            <Repeat size={20} />
            Đăng lại
          </button>

          <button
            onClick={handleSharing}
            disabled={sharing}
            className="btn btn-info rounded-3xl flex items-center justify-center gap-2"
          >
            {sharing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Đang tải...
              </>
            ) : (
              <>
                <Share size={20} />
                Chia sẻ
              </>
            )}
          </button>

          <button
            onClick={() => {
              setOptionModalOpen(false);
              setOpenModal(true);
            }}
            className="btn btn-error rounded-3xl w-full flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> Xoá
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
