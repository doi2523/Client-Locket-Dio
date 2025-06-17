export const getAvailableCameras = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((d) => d.kind === "videoinput");

  const ultraWideCamera = videoDevices.find((d) =>
    /ultra|siêu rộng|0.5x/i.test(d.label)
  );

  const normalCamera = videoDevices.find((d) =>
    /back|environment|1x|normal|camera/i.test(d.label)
  );

  const zoomCamera = videoDevices.find((d) =>
    /tele|zoom|2x|3x|5x/i.test(d.label)
  );

  return {
    allCameras: videoDevices,
    ultraWideCamera,
    normalCamera,
    zoomCamera,
  };
};
