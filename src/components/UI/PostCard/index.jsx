// components/PostCard.jsx
import React, { useEffect, useState } from "react";
import { Check, Download, Heart, MessageCircle, Send, Share2 } from "lucide-react";

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
      localStorage.setItem("savedPosts", JSON.stringify([...savedPosts, post]));
    }

    setIsDownloaded((prev) => !prev);
  };
  

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <img
            src={post.profile_picture}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {post.display_name}
            </p>
            <p className="text-xs text-gray-500">@{post.username}</p>
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
            background: `linear-gradient(to top, ${post.color_top}, ${post.color_bot})`,
            color: post.color_text,
          }}
        >
          <span className="text-base">
            {(post.icon || "") + " "}
            {post.caption || post.post_caption || "Caption"}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3 text-sm text-gray-800">{post.content}</div>

      <div className="px-4 pb-4 flex w-full justify-between items-center">
      <div className="flex gap-4 text-gray-600">
  <button className="flex items-center font-semibold gap-1 hover:text-pink-500">
    <Heart className="w-5 h-5" />
    <span>{post.hearts || 0}</span>
  </button>
  <button className="flex items-center gap-1 hover:text-blue-500">
    <MessageCircle className="w-5 h-5" />
    <span>{post.comments || 0}</span>
  </button>
  <div className="flex items-center gap-1 font-semibold text-gray-500">
    <Download className="w-5 h-5" />
    <span>{post.downloads || 0}</span>
  </div>
  <button className="flex items-center gap-1 hover:text-green-500">
    <Send className="w-5 h-5" />
    <span>{post.shares || 0}</span>
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
