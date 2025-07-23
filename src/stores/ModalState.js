import { useState } from "react";

export const ModalState = () => {
  const [isModalRegMemberOpen, setIsModalRegMemberOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // ✅ State mới cho modal thông báo lỗi (ví dụ: không có quyền)
  const [isModalNotifyOpen, setIsModalNotifyOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState(""); // nội dung thông báo

  const [isModalMoment, setIsModalMoment] = useState(false);

  return {
    // Modal đăng ký thành viên
    isModalRegMemberOpen, setIsModalRegMemberOpen,
    modalData, setModalData,

    // Modal thông báo lỗi/chặn truy cập
    isModalNotifyOpen, setIsModalNotifyOpen,
    notifyMessage, setNotifyMessage,
    isModalMoment, setIsModalMoment
  };
};
