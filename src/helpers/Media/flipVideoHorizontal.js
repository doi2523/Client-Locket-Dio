import { cropVideoToSquareV2 } from "./cropMedia";

export const correctFrontCameraVideo = (blob) => {
  return new Promise(async (resolve) => {
    try {
      // Cắt video thành hình vuông trước
      const croppedBlob = await cropVideoToSquareV2(blob);

      // Tạo thẻ video để xử lý lật ngang
      const video = document.createElement("video");
      video.src = URL.createObjectURL(croppedBlob);

      video.onloadedmetadata = () => {
        const size = Math.min(video.videoWidth, video.videoHeight);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = size;
        canvas.height = size;

        video.onplay = () => {
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

            // Lật ngang video
            ctx.save();
            ctx.translate(size, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, size, size, 0, 0, size, size);
            ctx.restore();

            requestAnimationFrame(drawFrame);
          };

          requestAnimationFrame(drawFrame);
        };

        video.play();
      };
    } catch (error) {
      console.error("Lỗi xử lý video:", error);
      resolve(blob); // Trả về video gốc nếu có lỗi
    }
  });
};
