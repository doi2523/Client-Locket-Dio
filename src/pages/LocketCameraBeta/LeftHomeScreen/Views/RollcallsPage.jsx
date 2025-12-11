import { getFriendDetail } from "@/cache/friendsDB";
import { getRollcallPosts } from "@/services";
import { replaceFirebaseWithCDN } from "@/utils/replace/replaceFirebaseWithCDN";
import React, { useState, useEffect } from "react";

function RollcallsPost({ active }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({}); // quản lý trạng thái mở comment theo post UID
  const [visibleCount, setVisibleCount] = useState(5); // số post hiển thị ban đầu

    useEffect(() => {
    if (active === "lockets") {
      setVisibleCount(5);
    }
  }, [active]);

  // Gọi API khi load màn
  const fetchPosts = async () => {
    try {
      const data = await getRollcallPosts();
      const postsWithUser = await Promise.all(
        data.map(async (post) => {
          const userDetail = await getFriendDetail(post.user);
          return { ...post, userDetail };
        })
      );
      setPosts(postsWithUser || []);
    } catch (error) {
      console.error("Failed to load rollcall posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p className="p-4">Đang tải...</p>;

  const toggleComments = (postUid) => {
    setOpenComments((prev) => ({
      ...prev,
      [postUid]: !prev[postUid],
    }));
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      // tăng số post hiển thị
      setVisibleCount((prev) => Math.min(prev + 5, posts.length));
    }
  };

  return (
    <div
      className="h-full p-4 w-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden"
      onScroll={handleScroll}
    >
      <h2 className="text-xl font-bold">Rollcalls Post</h2>

      {posts.slice(0, visibleCount).map((post) => (
        <div
          key={post.uid}
          className="bg-base-100 p-4 rounded-xl shadow flex flex-col gap-1"
        >
          {/* Thông tin user */}
          {post.userDetail && (
            <div className="flex items-center gap-2">
              <img
                src={post.userDetail.profilePic || "/images/default_avatar.png"}
                alt={post.userDetail.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">
                {post.userDetail?.firstName} {post.userDetail?.lastName}
              </span>
            </div>
          )}

          {/* Caption */}
          <p className="font-medium text-sm opacity-80">
            Tuần {post.week_of_year} • {post.items[0]?.location?.name || ""}
          </p>

          {/* Grid ảnh */}
          <div className="flex flex-row overflow-x-auto gap-2 p-2 bg-base-300 rounded-md">
            {post.items.map((item) => (
              <img
                key={item.uid}
                src={replaceFirebaseWithCDN(item.main_url)}
                alt="rollcall"
                className={`rounded-lg object-cover w-full
                  ${post.items.length === 1 ? "col-span-2 h-64" : "h-64"}`}
              />
            ))}
          </div>

          {/* Reactions */}
          {post.items[0]?.reactions?.length > 0 && (
            <div
              className="flex gap-1 text-lg mt-1 max-w-full overflow-hidden"
              title={post.items[0].reactions.map((r) => r.reaction).join(" ")}
            >
              {post.items[0].reactions.map((r, i) => (
                <span key={i} className="flex-shrink-0">
                  {r.reaction}
                </span>
              ))}
              {post.items[0].reactions.length > 10 && (
                <span className="flex-shrink-0">
                  +{post.items[0].reactions.length - 10}
                </span>
              )}
            </div>
          )}

          {/* Ngày đăng */}
          <span className="text-xs opacity-50">
            {new Date(post.created_at._seconds * 1000).toLocaleString()}
          </span>

          {/* Button mở comment */}
          {post.comments?.length > 0 && (
            <button
              onClick={() => toggleComments(post.uid)}
              className="text-sm text-blue-500 mt-1"
            >
              {openComments[post.uid] ? "Ẩn bình luận" : "Xem bình luận"}
            </button>
          )}

          {/* Comment */}
          {openComments[post.uid] &&
            post.comments.map((c) => (
              <div
                key={c.uid}
                className="ml-6 mt-2 p-2 bg-base-200 rounded-md text-sm flex flex-col gap-1"
              >
                <span className="font-medium">{c.user}</span>
                <span>{c.body}</span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default RollcallsPost;
