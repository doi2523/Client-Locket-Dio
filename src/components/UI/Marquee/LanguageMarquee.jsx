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
      <Marquee speed={25}>
        {images.map((src, index) => (
          <img
            src={src}
            alt={`Image ${index}`}
            className="object-contain w-20 h-20 mx-2"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default ImageMarquee;
