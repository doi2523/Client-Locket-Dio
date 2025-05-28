import React, { useContext, useState } from "react";
import { Edit, X } from "lucide-react";
import { AuthContext } from "../../../../context/AuthLocket";
import axios from "axios";
import { showError, showSuccess } from "../../../../components/Toast";
import { API_URL } from "../../../../utils";

const AddPostButton = () => {
  const { user, userPlan } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [colorTop, setColorTop] = useState("#FF9500");
  const [colorBot, setColorBot] = useState("#FF2D95");
  const [colorText, setColorText] = useState("#FFFFFF");
  const [content, setContent] = useState("");
  const [type, setType] = useState("background");

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      uid: user.uid,
      caption,
      color_top: colorTop,
      color_bot: colorBot,
      color_text: colorText,
      content,
      type,
      profile_picture: user.profilePicture,
      display_name: user.displayName,
      username: user.username,
    };

    axios
      .post(API_URL.POST_USER_THEMES_POSTS_URL, postData)
      .then((response) => {
        showSuccess("Bài viết đã được thêm thành công! 🎉");

        // Reset form
        setCaption("");
        setColorTop("#FF9500");
        setColorBot("#FF2D95");
        setColorText("#FFFFFF");
        setContent("");
        setType("background");
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        showError("Có lỗi xảy ra khi gửi bài viết. Vui lòng thử lại!");
      });
  };

  const toggleForm = () => {
    if (!userPlan?.plan_info?.features?.create_post) {
      alert(
        "Bạn không có quyền sử dụng tính năng này. Vui lòng nâng cấp gói thành viên để mở khóa."
      );
      return;
    }
    setShowForm(true);
  };

  return (
    <div>
      {/* Nút mở form */}
      <div
        className="fixed bottom-4 right-4 p-3 bg-primary rounded-full text-base-100 shadow-lg cursor-pointer"
        onClick={toggleForm}
      >
        <Edit size={32} />
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-all duration-500 linear ${
          showForm
            ? "bg-base-100/70 opacity-100 scale-100"
            : "opacity-0 scale-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-base-100 border-2 border-dashed text-base-content p-6 rounded-lg w-96 shadow-lg transform transition-all duration-500 linear ${
            showForm ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Thêm bài viết</h2>
            <button
              className="flex items-center justify-center rounded-md w-11 h-11 bg-base-300"
              type="button"
              onClick={() => setShowForm(false)}
            >
              <X size={30} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="gap-4 mb-4">
              <div className="mb-3">
                <label htmlFor="caption" className="block text-sm font-medium">
                  Caption
                </label>
                <input
                  type="text"
                  id="caption"
                  name="caption"
                  placeholder="Caption"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="type" className="block text-sm font-medium">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="background">Mặc định</option>
                  {/* <option value="theme">Chủ đề</option>
                    <option value="special">Đặc biệt</option>
                    <option value="event">Sự kiện</option> */}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium">Color Top</label>
                  <input
                    type="color"
                    className="mt-1 w-10 h-10 border rounded-sm"
                    value={colorTop}
                    onChange={(e) => setColorTop(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium">Color Bot</label>
                  <input
                    type="color"
                    className="mt-1 w-10 h-10 border rounded-sm"
                    value={colorBot}
                    onChange={(e) => setColorBot(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium">Color Text</label>
                  <input
                    type="color"
                    className="mt-1 w-10 h-10 border rounded-sm"
                    value={colorText}
                    onChange={(e) => setColorText(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label>Preview</label>
                <div
                  className="mt-2 p-2 px-3 font-semibold max-w-fit flex justify-center items-center rounded-3xl"
                  style={{
                    background: `linear-gradient(to bottom, ${colorTop}, ${colorBot})`,
                    color: colorText,
                  }}
                >
                  <span>{caption || "Caption"}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium">
                Nội dung
              </label>
              <textarea
                id="content"
                name="content"
                rows="4"
                placeholder="Thêm lời nhắn..."
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="absolute">Chỉ bấm gửi một lần tránh spam</p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Thêm Caption
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPostButton;
