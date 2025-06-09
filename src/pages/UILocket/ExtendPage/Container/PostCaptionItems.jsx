import React, { useEffect, useState } from "react";
import { Check, Download, Heart, MessageCircle, Send } from "lucide-react";

const PostCard = ({ post }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    const exists = savedPosts.some((p) => p.id === post.id);
    setIsDownloaded(exists);
  }, [post.id]);

  const toggleDownload = () => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");

    if (isDownloaded) {
      const updated = savedPosts.filter((p) => p.id !== post.id);
      localStorage.setItem("savedPosts", JSON.stringify(updated));
    } else {
      // Lưu chỉ id và options
      const newEntry = { id: post.id, options: post.options };
      localStorage.setItem(
        "savedPosts",
        JSON.stringify([...savedPosts, newEntry])
      );
    }

    setIsDownloaded((prev) => !prev);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3 ">
        <div className="flex items-center gap-3">
          <img
            src={post?.user_info?.profilePicture || "./images/prvlocket.png"}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
              {post?.user_info?.displayName || "Anonymous"}
              {" • "}
              <div className="flex items-center space-x-1">
                {/* Badge Admin */}
                {post?.user_info?.username === "diodio" && (
                  <span
                    className="px-2 py-0.5 text-xs rounded-full text-white font-semibold shadow-md"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #FBBF24, #F97316)", // vàng-cam
                    }}
                  >
                    Admin
                  </span>
                )}

                {post?.user_info?.plan ? (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold shadow-md ${
                      post.user_info.plan.toLowerCase() === "free"
                        ? "text-gray-800"
                        : "text-white"
                    }`}
                    style={{
                      backgroundImage:
                        post.user_info.plan.toLowerCase() === "premium"
                          ? "linear-gradient(45deg, #000000, #4B0082)" // đen → tím đậm
                          : post.user_info.plan.toLowerCase() === "pro"
                          ? "linear-gradient(45deg, #2563EB, #4F46E5)" // xanh → tím
                          : post.user_info.plan.toLowerCase() === "pro plus"
                          ? "linear-gradient(45deg, #10B981, #059669)"
                          : "linear-gradient(45deg, #D1D5DB , #E5E7EB)", // free
                    }}
                  >
                    {post.user_info.plan.charAt(0).toUpperCase() +
                      post.user_info.plan.slice(1)}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs rounded-full font-semibold shadow-md text-gray-700 bg-gray-300">
                    No Plan
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              @{post?.user_info?.username || "Anonymus"}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(post.created_at).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Caption Gradient */}
      <div className="w-full aspect-[2/0.5] flex items-center justify-center">
        <button
          className="flex flex-col whitespace-nowrap drop-shadow-lg items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
          style={{
            background: `linear-gradient(to bottom, ${post?.options?.color_top}, ${post?.options?.color_bottom})`,
            color: post?.options?.color_text,
          }}
        >
          <span className="text-base">
            {(post?.options?.icon || "") + " "}
            {post?.options?.caption || post?.options?.caption || "Caption"}
            {/* {"Caption"} */}
          </span>
        </button>
      </div>

      <div className="px-4 pb-4 flex w-full justify-between items-center">
        <div className="flex gap-4 text-gray-600">
          <button className="flex items-center font-semibold gap-1 hover:text-pink-500">
            <Heart className="w-5 h-5" />
            <span>{post?.stats?.hearts || 0}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500">
            <MessageCircle className="w-5 h-5" />
            <span>{post?.stats?.comments || 0}</span>
          </button>
          <div className="flex items-center gap-1 font-semibold text-gray-500">
            <Download className="w-5 h-5" />
            <span>{post?.stats?.downloads || 0}</span>
          </div>
          <button className="flex items-center gap-1 hover:text-green-500">
            <Send className="w-5 h-5" />
            <span>{post?.stats?.shares || 0}</span>
          </button>
        </div>

        {/* Bên phải: lượt tải và nút tải/lưu */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDownload}
            className={`text-xs font-medium rounded-full px-3 py-1 border transition ${
              isDownloaded
                ? "bg-green-100 text-green-600 border-green-300"
                : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {isDownloaded ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Đã lưu
              </span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
