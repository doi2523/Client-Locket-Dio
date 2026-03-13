import { useLocation, useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Sparkles, Heart, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getListNewFeeds } from "@/services";
import { RiShareForwardLine } from "react-icons/ri";
import NewsContentBlocks from "./NewsContentBlocks";

export default function NewsDetailPage() {
  const { slug } = useParams();
  const location = useLocation(); // lấy state
  const showBackButton = location.state?.fromList; // chỉ hiện khi có state
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  function setMeta(selector, content) {
    let el = document.querySelector(selector);
    if (el) el.setAttribute("content", content);
  }

  useEffect(() => {
    if (news?.title) {
      document.title = `${news.title} | Locket Dio - Đăng ảnh & Video lên Locket`;
      const url = "https://locket-dio.com" + location.pathname;
      const link =
        document.querySelector("link[rel='canonical']") ||
        document.head.appendChild(
          Object.assign(document.createElement("link"), { rel: "canonical" })
        );
      link.href = url;
      setMeta("meta[property='og:title']", document.title);
      setMeta("meta[property='og:url']", url);
      setMeta("meta[name='twitter:title']", document.title);
    }
  }, [location.pathname, news]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await getListNewFeeds(slug);
        setNews(data);
      } catch (err) {
        console.error("🚨 Lỗi khi tải bài viết:", err);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchNews();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen max-w-4xl mx-auto py-20 text-center">
        <img
          className="w-8 h-8 mx-auto mb-4 animate-spin"
          src="/svg/react.svg"
          alt=""
        />
        <p className="text-slate-600 text-lg">Đang tải bài viết...</p>
      </div>
    );

  if (!news)
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <Sparkles className="w-8 h-8 mx-auto text-blue-500 mb-4" />
        <p className="text-slate-600 text-lg">Không tìm thấy bài viết này 🎈</p>
        <Link
          to="/newsfeed"
          className="text-blue-600 font-medium mt-2 inline-block"
        >
          ← Quay lại trang tin tức
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-5 px-4">
      {showBackButton && (
        <Link
          to="/newsfeed"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition px-4 py-2 rounded-xl text-slate-700 font-medium shadow-sm hover:shadow-md mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
      )}

      {/* Title */}
      <h1 className="text-2xl font-bold mb-3">{news.title}</h1>

      {/* Date + Interactions */}
      <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
        {/* Date bên trái */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(news.published_at || news.start_at).toLocaleDateString(
            "vi-VN"
          )}
        </div>

        {/* Interactions bên phải */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {news.interactions?.views ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" /> {news.interactions?.likes ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <RiShareForwardLine className="w-4 h-4" />{" "}
            {news.interactions?.shares ?? 0}
          </span>
        </div>
      </div>

      {/* Thumbnail */}
      {news.thumbnail && (
        <img
          src={news.thumbnail}
          alt={news.title}
          className="rounded-2xl h-50 mb-2 shadow-md"
        />
      )}

      {/* Tags */}
      {news.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {news.tags.map((t) => (
            <span
              key={t}
              className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-lg"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="flex mt-2 mb-4 justify-center">
        <div className="w-full h-px bg-base-content/20"></div>
      </div>

      {/* Content blocks */}
      <NewsContentBlocks blocks={news.content?.blocks} title={news.title} />
    </div>
  );
}
