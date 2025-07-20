import React, { useContext, useEffect } from "react";
import { useApp } from "../../../context/AppContext";

export default function ModalExistingOrder({ onContinue, onCancel }) {
  const {
    modal: {
      isModalRegMemberOpen,
      setIsModalRegMemberOpen,
      setModalData,
    },
  } = useApp();

  const closeModal = () => {
    setIsModalRegMemberOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    if (isModalRegMemberOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalRegMemberOpen]);

  const modalScaleClass = isModalRegMemberOpen
    ? "scale-100 opacity-100"
    : "scale-0 opacity-0 pointer-events-none";

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
        isModalRegMemberOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeModal}
    >
      <div
        className={`modal-box max-w-md w-full bg-white text-black p-6 rounded-xl shadow-lg transform transition-transform duration-300 ${modalScaleClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Đơn hàng chưa hoàn tất
        </h3>
        <p className="text-gray-600 mb-6">
          Bạn đã có đơn hàng đang chờ thanh toán. Bạn muốn tiếp tục thanh toán hay huỷ đơn này?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              closeModal();
              onCancel?.();
            }}
            className="btn btn-outline"
          >
            Huỷ đơn
          </button>
          <button
            onClick={() => {
              closeModal();
              onContinue?.();
            }}
            className="btn btn-primary text-white"
          >
            Tiếp tục thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
