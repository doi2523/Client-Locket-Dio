const classifyVideoDevices = (videoDevices) => {
  const frontCameras = [];
  const backCameras = [];

  let backUltraWideCamera = null;
  let backNormalCamera = null;
  let backZoomCamera = null;
  const frontRegex =
    /mặt trước|front|user|trước|facing front|selfie|camera2 1|camera1 1/;
  const backRegex =
    /mặt sau|back|rear|environment|sau|facing back|outer|world|camera2 0|camera1 0/;

  videoDevices.forEach((device) => {
    const label = device.label.toLowerCase();

    // 📱 Camera trước
    if (frontRegex.test(label)) {
      frontCameras.push(device);
    }

    // 📷 Camera sau
    else if (backRegex.test(label)) {
      backCameras.push(device);

      // ➕ Phân loại theo đặc điểm
      if (/cực rộng|ultra|0.5x|góc rộng|camera2 2/.test(label)) {
        backUltraWideCamera ??= device;
      } else if (/chụp xa|tele|zoom|2x|3x|5x/.test(label)) {
        backZoomCamera ??= device;
      } else if (
        /camera kép|camera|bình thường|1x|rộng/.test(label) &&
        !/cực rộng|chụp xa|zoom|tele/.test(label)
      ) {
        backNormalCamera ??= device;
      }
    }
  });

  const remainingDevices = videoDevices.filter(
    (device) =>
      !frontCameras.some((camera) => camera.deviceId === device.deviceId) &&
      !backCameras.some((camera) => camera.deviceId === device.deviceId)
  );

  if (!backCameras.length && remainingDevices.length) {
    backCameras.push(remainingDevices[0]);
  }

  if (!frontCameras.length) {
    const fallbackFront = videoDevices.find(
      (device) => !backCameras.some((camera) => camera.deviceId === device.deviceId)
    );

    if (fallbackFront) {
      frontCameras.push(fallbackFront);
    }
  }

  backNormalCamera ??= backCameras[0] || null;

  return {
    allCameras: videoDevices,
    frontCameras,
    backCameras,
    backUltraWideCamera,
    backNormalCamera,
    backZoomCamera,
  };
};

export const getAvailableCameras = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  let videoDevices = devices.filter((d) => d.kind === "videoinput");
  const hasLabels = videoDevices.some((device) => device.label);

  if (!hasLabels) {
    const permissionStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    try {
      const refreshedDevices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = refreshedDevices.filter((d) => d.kind === "videoinput");
    } finally {
      permissionStream.getTracks().forEach((track) => track.stop());
    }
  }

  return classifyVideoDevices(videoDevices);
};