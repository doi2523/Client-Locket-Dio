import React from "react";
import UploadFile from "./UploadFile";
import CameraButton from "./CameraButton";
import CameraToggle from "./CameraToggle";

const CameraControls = () => {
  return (
    <>
      <UploadFile />
      <CameraButton />
      <CameraToggle />
    </>
  );
};

export default CameraControls;
