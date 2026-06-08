import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Users } from "lucide-react";
import { SonnerPromise, SonnerInfo } from "@/components/ui/SonnerToast";
import { updateGroupName } from "@/services";

const EditGroupPoup = ({
  open,
  onClose,
  group,
  onUpdated,
  loading = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [name, setName] = useState(group?.name || "");
  const [avatar, setAvatar] = useState(group?.image_url || null);

  const [loadingField, setLoadingField] = useState(null);

  useEffect(() => {
    setName(group?.name || "");
    setAvatar(group?.image_url || null);
  }, [group]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showModal]);

  useEffect(() => {
    if (open) {
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [open]);

  if (!showModal) return null;

  // SAVE NAME
  const handleSaveName = () => {
    setLoadingField("name");

    const promise = updateGroupName({
      groupId: group.id,
      name,
    });

    SonnerPromise(promise, {
      loading: "Đang cập nhật tên nhóm...",
      success: (res) => {
        if (res) onUpdated?.(res);
        return "Cập nhật thành công 🎉";
      },
      error: "Cập nhật thất bại!",
    });

    promise.finally(() => setLoadingField(null));
  };

  // CHANGE AVATAR (placeholder)
  const handleChangeAvatar = () => {
    SonnerInfo("Tính năng thay đổi ảnh sắp ra mắt 🚀");
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[80] ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={!loading ? onClose : undefined}
    >
      <div
        className={`fixed h-2/3 border-t border-base-300 bottom-0 left-0 w-full pt-6 pb-6 px-5 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 z-[81] flex flex-col text-base-content
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TITLE */}
        <h3 className="text-xl font-semibold text-center mb-6">
          Thông tin nhóm
        </h3>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                className="w-24 h-24 rounded-full object-cover border-2 border-base-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
            )}
          </div>

          <button
            onClick={handleChangeAvatar}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Thay đổi ảnh
          </button>
        </div>

        {/* NAME INPUT */}
        <div className="space-y-2">
          <label className="text-sm text-base-content/60">Tên nhóm</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full rounded-xl focus:outline-none"
            placeholder="Nhập tên nhóm..."
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="mt-6">
          <button
            onClick={handleSaveName}
            disabled={loadingField === "name"}
            className="btn btn-primary rounded-3xl w-full"
          >
            {loadingField === "name" ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="btn btn-neutral btn-outline w-full mt-3 rounded-3xl"
        >
          Đóng
        </button>

        <div className="mt-auto py-4 border-t border-base-300">
          <div className="flex flex-col gap-2">
            {/* small info */}
            <p className="text-center text-xs text-base-content/40">
              © DioxChisadin • Group settings
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default EditGroupPoup;
