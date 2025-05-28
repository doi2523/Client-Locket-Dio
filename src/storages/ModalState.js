import { useState } from "react";

export const ModalState = () => {
  const [isModalRegMemberOpen, setIsModalRegMemberOpen] = useState(false);
  // state để lưu giá trị dữ liệu truyền cho modal (nếu cần)
  const [modalData, setModalData] = useState(null);

  return {
    isModalRegMemberOpen, setIsModalRegMemberOpen,
    modalData, setModalData
  };
};
