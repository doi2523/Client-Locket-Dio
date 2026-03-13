import { createImage } from "./createImage";

//Tìm gì mà vào tận đây thế :)))
export const getCroppedImg = async (imageSrc, crop, rotation = 0) => {
  //Gọi hàm để tạo mới một ảnh
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  const { width, height } = image;
  const croppedWidth = crop.width;
  const croppedHeight = crop.height;

  canvas.width = croppedWidth;
  canvas.height = croppedHeight;

  ctx.save();
  ctx.translate(croppedWidth / 2, croppedHeight / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -croppedWidth / 2,
    -croppedHeight / 2,
    croppedWidth,
    croppedHeight
  );
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        return;
      }
      // Chuyển đổi blob thành File
      const file = new File([blob], "cropped-image.jpg", { type: blob.type });
      resolve(file); // ✅ Trả về File thay vì blob URL
    }, "image/jpeg");
  });
};
