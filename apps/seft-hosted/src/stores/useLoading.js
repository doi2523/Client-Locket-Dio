import { useState } from "react";

export const useLoading = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);
  const [sendLoading, setSendLoading ] = useState(null);
  const [uploadLoading, setUploadLoading ] = useState(false);
  const [isStatusServer, setIsStatusServer] = useState(null); // null: đang kiểm tra, true/false: kết quả
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  return {
    imageLoaded, setImageLoaded,
    isCaptionLoading, setIsCaptionLoading,
    sendLoading, setSendLoading,
    uploadLoading, setUploadLoading,
    isStatusServer, setIsStatusServer,
    isLoginLoading, setIsLoginLoading
  };
};
