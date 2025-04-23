import React, { useContext, useState } from "react";
import { Edit, X } from "lucide-react";
import { AuthContext } from "../../../context/AuthLocket";
import axios from "axios";

const AddPostButton = ({ onNewPost }) => {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [icon, setIcon] = useState("");
  const [caption, setCaption] = useState("");
  const [colorTop, setColorTop] = useState("#FF9500");
  const [colorBot, setColorBot] = useState("#FF2D95");
  const [colorText, setColorText] = useState("#FFFFFF");
  const [content, setContent] = useState("");

  // Hàm xử lý gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const postData = {
      uid: user.uid,
      icon,
      caption,
      color_top: colorTop,
      color_bot: colorBot,
      color_text: colorText,
      content,
      profile_picture: user.profilePicture,
      display_name: user.displayName,
      username: user.username,
    };
  
    axios
      .post("https://server-admin-xi.vercel.app/posts", postData)
      .then((response) => {
        console.log("Response from API:", response.data);
        alert("Bài viết đã được thêm thành công! 🎉");
  
        // Reset form
        setIcon("");
        setCaption("");
        setColorTop("#FF9500");
        setColorBot("#FF2D95");
        setColorText("#FFFFFF");
        setContent("");
  
        // Đóng form
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        alert("Có lỗi xảy ra khi gửi bài viết. Vui lòng thử lại!");
      });
  };
  

  // Hàm để xử lý sự kiện click
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      {/* Nút với icon bút */}
      <div
        className="fixed bottom-4 right-4 p-3 bg-primary rounded-full text-base-100 shadow-lg cursor-pointer"
        onClick={toggleForm}
      >
        <Edit size={32} />
      </div>

      {/* Form thêm bài viết */}
      {showForm && (
        <div className="fixed inset-0 bg-base-100/50 backdrop-blur-[2px] bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-base-100 border text-base-content p-6 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Thêm bài viết</h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="gap-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium">
                      Icon
                    </label>
                    <input
                      type="text"
                      id="icon"
                      name="icon"
                      placeholder="Icon"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="caption"
                      className="block text-sm font-medium"
                    >
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
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex justify-center flex-col items-center">
                    <label
                      htmlFor="color-top"
                      className="block text-sm font-medium"
                    >
                      Color Top
                    </label>
                    <input
                      type="color"
                      id="color-top"
                      name="color-top"
                      className="mt-1 p-0 w-10 h-10 border border-gray-300 rounded-sm"
                      value={colorTop}
                      onChange={(e) => setColorTop(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center flex-col items-center">
                    <label
                      htmlFor="color-bot"
                      className="block text-sm font-medium"
                    >
                      Color Bot
                    </label>
                    <input
                      type="color"
                      id="color-bot"
                      name="color-bot"
                      className="mt-1 p-0 w-10 h-10 border border-gray-300 rounded-sm"
                      value={colorBot}
                      onChange={(e) => setColorBot(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center flex-col items-center">
                    <label
                      htmlFor="color-text"
                      className="block text-sm font-medium"
                    >
                      Color Text
                    </label>
                    <input
                      type="color"
                      id="color-text"
                      name="color-text"
                      className="mt-1 p-0 w-10 h-10 border border-gray-300 rounded-sm"
                      value={colorText}
                      onChange={(e) => setColorText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="preview">Preview</label>
                  <div
                    className="mt-2 p-2 px-3 font-semibold max-w-fit flex justify-center items-center rounded-3xl"
                    style={{
                      background: `linear-gradient(to bottom, ${colorTop}, ${colorBot})`,
                    }}
                  >
                    <div
                      className="flex items-center"
                      style={{ color: colorText }}
                    >
                      <span>{icon}</span>
                      <span>{caption || "Caption"}</span>
                    </div>
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
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPostButton;
