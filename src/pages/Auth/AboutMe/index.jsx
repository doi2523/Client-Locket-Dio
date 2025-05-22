import React from "react";
import {
  Code2,
  Github,
  Mail,
  Braces,
  Palette,
  Database,
  Flame,
  Coffee,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import ImageMarquee from "../../../components/UI/Marquee/LanguageMarquee";
import {
  FaReact,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaNodeJs,
} from "react-icons/fa";
import { RiTailwindCssFill, RiVercelFill } from "react-icons/ri";
import DonateHistory from "../../Public/HistoryDonate";

const AboutMe = () => {
  return (
    <>
      {" "}
      <div className="h-20"></div>
      <div className="min-h-screen flex flex-col px-6 items-center">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/avtdio.webp" // đổi thành avatar của bạn
            alt="Dio Avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-semibold text-center">
            Đào Văn Đôi (Dio)
          </h1>
          <p className="text-lg md:text-xl mt-2">
            Web Developer | Thích sáng tạo và học hỏi
          </p>
        </div>

        {/* About */}
        <div className="max-w-3xl text-left mb-12">
          <p className="text-lg leading-relaxed">
            Mình là sinh viên năm cuối ngành CNTT, đam mê lập trình web và xây
            dựng sản phẩm thực tế.
          </p>
        </div>

        {/* Skills */}
        <div className="w-full mb-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 flex justify-center items-center gap-2">
            <Code2 className="w-6 h-6 md:w-8 md:h-8" /> Công nghệ mình dùng
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-lg">
            <div className="flex items-center gap-2">
              <FaReact className="w-6 h-6 text-cyan-500" /> React.js
            </div>
            <div className="flex items-center gap-2">
              <img src="/vite.svg" className="w-6.5 h-6.5" /> Vite
            </div>
            <div className="flex items-center gap-2">
              <FaNodeJs className="w-6 h-6 text-green-500" /> Node.js
            </div>
            <div className="flex items-center gap-2">
              <img src="/Logomark_Full Color.svg" className="w-6 h-6" />{" "}
              Firebase
            </div>
            <div className="flex items-center gap-2">
              <FaGithub className="w-6 h-6 text-black" /> Github
            </div>
            <div className="flex items-center gap-2">
              <RiTailwindCssFill className="w-6 h-6 text-cyan-500" />{" "}
              TailwindCSS
            </div>
            <div className="flex items-center gap-2">
              <RiVercelFill className="w-6 h-6 text-black" /> Vercel
            </div>
            <div className="flex items-center gap-2">
              <img src="/logo.light.svg" /> Lucide Icons
            </div>
            <div className="flex items-center">
              <img src="/daisyui-logomark.svg" className="w-8 h-8" /> DaisyUi
            </div>
          </div>
          <ImageMarquee />
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-5 flex justify-center items-center gap-2">
            <Globe /> Liên hệ & Mạng xã hội
          </h2>
          <div className="flex justify-center gap-4 text-2xl md:text-3xl">
            {/* Existing Social Links */}
            <a
              href="https://github.com/doi2523"
              target="_blank"
              rel="noopener noreferrer"
              className="transition"
            >
              <FaGithub className="w-6 h-6 text-black" />
            </a>
            <a
              href="mailto:doibncm2003@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition"
            >
              <Mail className="w-6 h-6 text-black" />
            </a>

            {/* New Social Links */}
            <a
              href="https://facebook.com/daovandoi2003"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <FaFacebook className="w-6 h-6 text-blue-600" />
            </a>
            <a
              href="https://instagram.com/_am.dio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram className="w-6 h-6 text-pink-500" />
            </a>
            <a
              href="https://tiktok.com/@amdio25"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
            >
              <FaTiktok className="w-6 h-6 text-black" />
            </a>
            <a
              href="https://locket.cam/diodio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
            >
              <img src="/prvlocket.png" className="w-6 h-6 rounded-md" />
            </a>
          </div>
        </div>
        {/* Phần Donate */}
      </div>
      <div className="relative mb-10 text-center px-3 mt-6">
        {/* Phần Donate */}
        <h3 className="flex justify-center items-center text-2xl font-semibold mb-4 gap-2">
          <Coffee /> Give me a coffee
        </h3>
        <div className="flex flex-col items-center">
          {/* Hình ảnh vuông */}
          <img
            src="donate.jpg" // Thay bằng link ảnh của bạn
            alt="Donate"
            className="w-37 h-37 object-cover mb-4 rounded-lg shadow-xl"
          />
          {/* Thông tin tài khoản */}
          <p className="text-lg font-medium">STK: 66222222222266</p>
          <p className="text-lg font-medium">CTK: DAO VAN DOI - MBBANK</p>
          <p className="my-4 text-sm">
            Mọi đóng góp đều giúp mình cải thiện dịch vụ và duy trì trang web.
            Cảm ơn sự ủng hộ của bạn!
          </p>
        </div>
        <DonateHistory />
      </div>
    </>
  );
};

export default AboutMe;
