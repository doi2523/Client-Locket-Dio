export const correctFrontCameraVideo = (blob) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(blob);
    video.muted = true; // Giúp video tự động phát trên một số trình duyệt
    video.playsInline = true; // Giúp tránh mở full màn hình trên di động

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;

      video.play().then(() => {
        const stream = canvas.captureStream();
        const recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
        const chunks = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: "video/mp4" }));
        };

        recorder.start();

        const drawFrame = () => {
          if (video.ended) {
            recorder.stop();
            return;
          }

          const xOffset = (video.videoWidth - size) / 2;
          const yOffset = (video.videoHeight - size) / 2;
          ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);

          requestAnimationFrame(drawFrame);
        };

        requestAnimationFrame(drawFrame);
      });
    };
  });
};
