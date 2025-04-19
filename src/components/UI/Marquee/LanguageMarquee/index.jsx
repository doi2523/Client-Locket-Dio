import Marquee from "react-fast-marquee";

const ImageMarquee = () => {
  const images = [
    "https://reactnative.dev/img/header_logo.svg",
    "https://vite.dev/logo.svg",
    "https://www.svgrepo.com/show/303658/nodejs-1-logo.svg",
    "https://tailwindcss.com/_next/static/media/tailwindcss-logotype.a1069bda.svg",
    "https://www.svgrepo.com/show/354128/npm.svg",
    "https://www.svgrepo.com/show/354512/vercel.svg",
    "https://www.gstatic.com/devrel-devsite/prod/vd31e3ed8994e05c7f2cd0cf68a402ca7902bb92b6ec0977d7ef2a1c699fae3f9/firebase/images/lockup.svg",
    "https://img.daisyui.com/images/daisyui-logo/daisyui-logotype.svg",
    "https://github.githubassets.com/favicons/favicon.svg",
  ];

  return (
    <div className="relative py-4 overflow-hidden disable-select">
      <Marquee
        speed={30}
        gradient={true}
        gradientColor={[248, 251, 253]} // màu trắng xanh nhạt như nền
        gradientWidth={100}             // đủ rộng để thấy rõ hiệu ứng
      >
        {images.map((src, index) => (
          <div key={index} className="w-22 h-22 mx-2 flex justify-center items-center">
            <img
              src={src}
              alt={`Image ${index}`}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default ImageMarquee;
