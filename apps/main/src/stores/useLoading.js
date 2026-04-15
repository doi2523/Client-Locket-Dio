import { useState } from "react";

export const useLoading = () => {
  const [sendLoading, setSendLoading ] = useState(null);
  const [uploadLoading, setUploadLoading ] = useState(false);

  return {
    sendLoading, setSendLoading,
    uploadLoading, setUploadLoading,
  };
};
