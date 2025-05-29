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

const POSTS_PER_PAGE = 10;

const LeftHomeScreen = () => {
  const { user } = useContext(AuthContext);
  const { navigation, useloading } = useApp();
  const { isProfileOpen, setIsProfileOpen } = navigation;
  const { imageLoaded, setImageLoaded } = useloading;

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef(null);
  const [posts, setPosts] = useState([]);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const div = scrollRef.current;
    const handleScroll = () => {
      setIsScrolled(div.scrollTop > 1);
    };
    if (div) div.addEventListener("scroll", handleScroll);
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
    // Scroll lên đầu danh sách khi đổi trang (tuỳ chọn)
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col transition-transform duration-500 z-50 bg-base-100 ${
        isProfileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <AddPostButton />

      {/* Header */}
      <div className="flex flex-col shadow-lg px-4 py-2 text-base-content relative overflow-hidden">
        <div className="flex items-center justify-between">
          <BadgePlan />
          <div className="flex items-center gap-3">
            <button>
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

        <div
          className={`relative transition-all z-30 duration-500 ease-in-out ${
            isScrolled ? "h-0 opacity-0" : "h-19 mt-2"
          }`}
        >
          <div className="flex flex-row justify-between items-center text-base-content w-full">
            <div className="flex flex-col text-center items-start space-y-1">
              <p className="text-2xl font-semibold">
                {user?.displayName || "Name"}
              </p>
              <a
                href={`https://locket.cam/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link underline font-semibold flex items-center justify-between"
              >
                @{user?.username} <Link className="ml-2" size={18} />
              </a>
            </div>
            <div className="avatar w-18 h-18 disable-select">
              <div className="rounded-full shadow-md outline-4 outline-amber-400 p-1 flex justify-items-center">
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

      {/* Posts */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Phân trang đơn giản */}
        <div className="flex justify-center items-center space-x-3 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftHomeScreen;
