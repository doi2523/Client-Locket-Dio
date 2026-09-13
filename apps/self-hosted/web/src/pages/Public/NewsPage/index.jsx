import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Calendar,
  Megaphone,
  Gift,
  Lightbulb,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
} from "lucide-react";
import { RiShareForwardLine } from "react-icons/ri";
import { getListNewFeeds } from "@/services";
import { CONFIG } from "@/config";

const iconMap = {
  update: Sparkles,
  event: Gift,
  announcement: Megaphone,
  tip: Lightbulb,
  default: Sparkles,
};

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const posts = await getListNewFeeds();
        if (Array.isArray(posts)) setNews(posts);
      } catch (error) {
        console.error("🚨 Lỗi khi tải news:", error);
      }
    };
    fetchNews();
  }, []);

  // Tính số bài viết theo từng category
  const counts = news.reduce((acc, n) => {
    const cat = n.category || "unknown";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    { id: "all", label: "Tất cả", icon: Filter, length: news.length },
    ...CONFIG.ui.categories.map((c) => ({
      ...c,
      icon: iconMap[c.id] || iconMap.default,
      length: counts[c.id] || 0,
    })),
  ];

  const filteredNews =
    selectedCategory === "all"
      ? news
      : news.filter((n) => n.category === selectedCategory);

  // Scroll xử lý
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkScroll = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [news]);

  const scrollBy = (offset) =>
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-6 px-6 relative">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bảng tin
          </h1>
          <p className="text-base-content mt-1 max-w-xl">
            Các bài viết về bản cập nhật mới nhất về tính năng, sự kiện hoặc sự cải tiến của Locket Dio 🎉.
          </p>
        </div>

        {/* Category Filter */}
        <div className="relative mb-4">
          <div className="flex items-center gap-2 mb-2 text-base-content/70 font-medium">
            <Filter className="w-4 h-4" /> Danh mục
          </div>

          {canScrollLeft && (
            <button
              onClick={() => scrollBy(-200)}
              className="absolute left-0 top-8 z-10 p-2 bg-white/90 rounded-full shadow hover:bg-slate-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollBy(200)}
              className="absolute right-0 top-8 z-10 p-2 bg-white/90 rounded-full shadow hover:bg-slate-100 transition"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar scroll-smooth"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-black text-white shadow-md"
                      : "bg-base-100 hover:bg-base-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label} ({cat.length})
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex mt-2 mb-4 justify-center">
          <div className="w-full h-px bg-base-content/20"></div>
        </div>

        {/* News Grid */}
        {filteredNews.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((n) => (
              <div
                key={n.id}
                className="group bg-base-100 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-base-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-60 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                  {n.thumbnail ? (
                    <img
                      src={n.thumbnail}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-blue-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(n.published_at)}</span>
                  </div>
                  {/* Title */}
                  <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {n.title}
                  </h3>
                  {/* Tags row */}{" "}
                  {n.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {" "}
                      {n.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-lg"
                        >
                          {" "}
                          #{t}{" "}
                        </span>
                      ))}{" "}
                    </div>
                  )}
                  {/* Description */}
                  <p className="text-sm text-base-content/70 line-clamp-3 mb-4 flex-1">
                    {n.description}
                  </p>
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-base-300">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {n.interactions?.views ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {n.interactions?.likes ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <RiShareForwardLine className="w-4 h-4" />
                        {n.interactions?.shares ?? 0}
                      </span>
                    </div>

                    <Link
                      to={`/newsfeed/${n.slug}`}
                      state={{ fromList: true }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:gap-2 transition-all"
                    >
                      Đọc thêm
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-slate-600 text-lg">Không có bài viết nào 🎈</p>
          </div>
        )}
      </div>

      {/* Ẩn thanh cuộn */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
