import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const ConfirmPoup = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  labelConfirm = "Xác nhận",
  loading = false,
  loadingText = "Đang xử lý...",
  icon,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

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

  const baseBtn =
    "btn btn-lg text-base font-semibold rounded-3xl w-full sm:w-auto sm:min-w-[140px] px-6 flex items-center justify-center gap-2";

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[62] ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={!loading ? onClose : undefined}
    >
      <div
        className={`fixed border-t border-base-300 bottom-0 left-0 w-full pt-6 pb-6 px-5 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 ease-in-out z-[63] flex flex-col text-base-content
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

        {title && (
          <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
        )}

        {children && (
          <div className="text-base text-center text-base-content/80 space-y-2">
            {typeof children === "string"
              ? children.split("\n").map((line, i) => <p key={i}>{line}</p>)
              : children}
          </div>
        )}

        {/* Actions */}
        <div className="w-full mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${baseBtn} btn-warning ${
              loading ? "btn-disabled" : ""
            }`}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {loadingText}
              </>
            ) : (
              labelConfirm
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className={`${baseBtn} btn-neutral btn-outline`}
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmPoup;
