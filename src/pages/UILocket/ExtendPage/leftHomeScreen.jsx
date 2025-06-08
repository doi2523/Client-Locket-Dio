import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { ChevronRight, Link, Settings } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import AddPostButton from "./Button/AddPostButton";
import axios from "axios";
import LoadingRing from "../../../components/UI/Loading/ring";
import PostCard from "./Container/PostCaptionItems";
import { API_URL } from "../../../utils";
import BadgePlan from "./Badge";

const POSTS_PER_PAGE = 5;

const LeftHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, useloading } = useApp();
  const {
    isProfileOpen,
    setIsProfileOpen,
    isSettingTabOpen,
    setSettingTabOpen,
  } = navigation;
  const { imageLoaded, setImageLoaded } = useloading;

  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);
  const [posts, setPosts] = useState([]);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const div = scrollRef.current;
    const handleScroll = () => {
      if (div) {
        // Tính toán progress từ 0 đến 1 dựa trên scroll position
        // Sử dụng 100px làm khoảng cách để hoàn thành animation
        const maxScroll = 100;
        const progress = Math.min(div.scrollTop / maxScroll, 1);
        setScrollProgress(progress);
      }
    };

    if (div) {
      div.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => div?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(API_URL.CAPTION_POSTS_URL);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isProfileOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isProfileOpen]);

  // Tính toán posts hiển thị theo trang
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Tổng số trang
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  // Hàm chuyển trang
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    // Scroll lên đầu danh sách khi đổi trang với smooth behavior
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Tính toán giá trị động cho animation - header luôn hiển thị nhưng thu gọn dần
  const userInfoHeight = 76 * (1 - scrollProgress); // Chiều cao user info thu gọn từ 76px về 0
  const userInfoOpacity = Math.max(0, 1 - scrollProgress * 1.5); // Opacity giảm dần
  const userInfoScale = Math.max(0.8, 1 - scrollProgress * 0.2); // Scale từ 1 về 0.8
  const userInfoTranslateY = scrollProgress * -15; // Di chuyển lên trên

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 bg-base-100 ${
        isProfileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <AddPostButton />

      {/* Header - luôn hiển thị với chiều cao cố định cho phần chính */}
      <div className="flex flex-col shadow-lg px-4 py-2 text-base-content relative bg-base-100 z-10">
        <div className="flex items-center justify-between relative z-40">
          <BadgePlan />
          <div className="flex items-center gap-3">
            <button onClick={() => setSettingTabOpen(true)}>
              <Settings size={30} />
            </button>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="rounded-lg hover:bg-base-200 transition cursor-pointer"
            >
              <ChevronRight size={40} />
            </button>
          </div>
        </div>

        {/* User info section - thu gọn từ từ theo scroll */}
        <div
          className="relative overflow-hidden"
          style={{
            height: `${userInfoHeight}px`,
            transition: "height 0.1s ease-out",
            marginTop: userInfoHeight > 10 ? "8px" : "0px",
          }}
        >
          <div
            className="flex flex-row justify-between items-center text-base-content w-full origin-top"
            style={{
              opacity: userInfoOpacity,
              transform: `scale(${userInfoScale}) translateY(${userInfoTranslateY}px)`,
              transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
            }}
          >
            <div className="flex flex-col text-center items-start space-y-1">
              <p className="text-2xl font-semibold whitespace-nowrap">
                {user?.displayName || "Name"}
              </p>
              <a
                href={`https://locket.cam/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link underline font-semibold flex items-center justify-between whitespace-nowrap"
              >
                @{user?.username} <Link className="ml-2" size={18} />
              </a>
            </div>
            <div className="avatar w-18 h-18 disable-select flex-shrink-0">
              <div className="rounded-full shadow-md border-4 border-amber-400 p-1 flex justify-items-center">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingRing size={40} stroke={2} color="blue" />
                  </div>
                )}
                <img
                  src={user?.profilePicture || "/prvlocket.png"}
                  alt="Profile"
                  className={`w-19 h-19 transition-opacity duration-300 rounded-full ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts với smooth scrolling */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Phân trang với improved styling */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-8 pb-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border bg-base-200 text-base-content disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-300 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Trước
            </button>

            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${
                      currentPage === page
                        ? "bg-primary text-primary-content shadow-lg transform scale-105"
                        : "bg-base-200 text-base-content hover:bg-base-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border bg-base-200 text-base-content disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-300 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Sau
            </button>
          </div>
        )}

        {/* Hiển thị thông tin trang */}
        {totalPages > 1 && (
          <div className="text-center text-sm text-base-content opacity-70 pb-4">
            Trang {currentPage} / {totalPages} ({posts.length} bài viết)
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftHomeScreen;
