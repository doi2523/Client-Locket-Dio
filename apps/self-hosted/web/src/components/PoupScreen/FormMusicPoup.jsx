import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const FormMusicPoup = ({
  open,
  onClose,
  title,
  onConfirm,
  loading = false,
  loadingText = "Đang xử lý...",
  icon,
  formType = "spotify",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [musicLink, setMusicLink] = useState("");

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
      setMusicLink("");
    }
  }, [open]);

  if (!showModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!musicLink.trim()) return;
    onConfirm?.(musicLink.trim());
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[99] text-base-content ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={!loading ? onClose : undefined}
    >
      <div
        className={`fixed border-t border-base-300 bottom-0 left-0 w-full pt-6 pb-6 px-5 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[100] flex flex-col
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-300 shadow-md">
              {icon}
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>

        <p className="text-sm text-center text-base-content/70 mb-4">
          Caption nhạc chỉ hiển thị trên iOS (Android vẫn đăng ảnh nhưng không
          có caption nhạc).
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={musicLink}
            onChange={(e) => setMusicLink(e.target.value)}
            placeholder={
              formType === "apple"
                ? "https://music.apple.com/..."
                : "https://open.spotify.com/track/..."
            }
            className="input input-ghost input-md border border-base-content w-full rounded-2xl"
            required
          />

          <div className="flex justify-center flex-col sm:flex-row gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-warning btn-lg rounded-3xl w-full sm:w-auto sm:min-w-[140px]"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {loadingText}
                </>
              ) : (
                "Gửi"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-neutral btn-outline btn-lg rounded-3xl w-full sm:w-auto sm:min-w-[140px]"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default FormMusicPoup;
