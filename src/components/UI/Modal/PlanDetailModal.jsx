import React, { useEffect } from "react";
import { useApp } from "../../../context/AppContext";

export default function ModalRegisterMember() {
  const {
    modal: {
      isModalRegMemberOpen,
      setIsModalRegMemberOpen,
      modalData,
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
  // Class modal scale:
  // khi đóng: scale-0 và opacity-0 (ẩn)
  // khi mở: scale-100 và opacity-100 (hiện)
  // transition mượt với duration-300
  const modalScaleClass = isModalRegMemberOpen
    ? "scale-100 opacity-100"
    : "scale-0 opacity-0 pointer-events-none";

  return (
    // Overlay: sử dụng daisyUI modal-wrapper
    <div
      className={`fixed h-screen inset-0 bg-base-100/30 overflow-hidden backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300 ${
        isModalRegMemberOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeModal}
    >
      <div
        className={`modal-box outline-2 outline-dashed outline-base-content bg-base-200 text-base-content px-5 py-4 rounded-xl shadow-lg transform transition-transform duration-300 ${modalScaleClass}`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "420px", width: "90%" }}
      >
        <h3 className="font-bold text-lg text-center mb-4">
          Thông tin gói đăng ký
        </h3>

        {modalData ? (
          <div className="space-y-4 text-sm">
            {/* Logo + Tên gói + Giá */}
            <div className="flex items-center space-x-3">
              <img
                src={modalData.logoUrl || "./images/prvlocket.png"}
                alt="Logo"
                className="w-12 h-12 rounded-full border border-gray-300 object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-xl text-purple-500">
                  {modalData.name || "Tên gói"}
                </div>
                <div className="text-[13px] text-gray-500">
                  {modalData.price === 0 ? (
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  ) : (
                    modalData.price.toLocaleString() + "đ"
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="gap-x-4 gap-y-2">
              <div className="flex flex-row gap-2">
                <p className="text-gray-500">Thời hạn: </p>
                <span className="font-semibold">
                  {" "}
                  {modalData.duration_days
                    ? `${modalData.duration_days} ngày`
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-row gap-2">
                <p className="text-gray-500">Tối đa ảnh/video:</p>
                <p className="font-semibold">
                  {" "}
                  {modalData.max_uploads || "N/A"}
                </p>
              </div>
            </div>

            {/* Tính năng */}
            <div>
              <p className="font-semibold mb-1">Các tính năng:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                {modalData.perks
                  ? Object.entries(modalData.perks).map(([perk, available]) => (
                      <li
                        key={perk}
                        className={
                          available
                            ? "text-green-600"
                            : "text-gray-400 line-through"
                        }
                      >
                        {perk}
                      </li>
                    ))
                  : "Không có thông tin"}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Không có dữ liệu để hiển thị.
          </p>
        )}

        <div className="modal-action mt-5 flex justify-center space-x-3">
          <button className="btn btn-outline btn-sm px-5" onClick={closeModal}>
            Đóng
          </button>
          <button
            className="btn btn-primary btn-sm px-5"
            onClick={() => {
              alert("Vui lòng liên hệ quản trị viên để nâng cấp gói đăng ký.");
            }}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
}
