import Marquee from "react-fast-marquee";

const ImageMarquee = () => {
  const images = [
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K",
    "https://vite.dev/logo.svg",
    "https://www.svgrepo.com/show/303658/nodejs-1-logo.svg",
    "https://tailwindcss.com/_next/static/media/tailwindcss-logotype.a1069bda.svg",
    "https://www.svgrepo.com/show/354128/npm.svg",
    "https://www.svgrepo.com/show/354512/vercel.svg",
    "https://firebase.google.com/static/images/brand-guidelines/logo-vertical.png",
    "https://img.daisyui.com/images/daisyui-logo/daisyui-logotype.svg",
    "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
  ];

  return (
    <div className="py-4">
      <Marquee speed={50} gradient={true} gradientColor={[255, 255, 255]}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index}`}
            className="w-20 h-20 mx-2"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default ImageMarquee;
