import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ open, onClose, title, children, actions }) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Lock scroll khi mở modal
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Xử lý mở/đóng modal với animation
  useEffect(() => {
    if (open) {
      // Mở modal với animation
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      // Đóng modal với animation
      setAnimate(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [open]);

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center 
        bg-black/40 backdrop-blur-sm transition-opacity duration-300 
        ${animate ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      {/* Hộp nội dung */}
      <div
        className={`relative bg-base-100 rounded-2xl p-6 w-[90%] max-w-sm shadow-xl 
          transform transition-all duration-300 text-base-content 
          ${animate ? "scale-100 translate-y-0" : "scale-90 translate-y-4"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}

        <div className="text-sm text-base-content/80 mb-4">{children}</div>

        {actions && <div className="flex justify-end gap-2">{actions}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;