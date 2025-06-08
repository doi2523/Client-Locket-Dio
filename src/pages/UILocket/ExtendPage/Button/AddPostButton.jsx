import React, { useContext, useState } from "react";
import { Edit, X } from "lucide-react";
import { AuthContext } from "../../../../context/AuthLocket";
import axios from "axios";
import { showError, showSuccess } from "../../../../components/Toast";
import { API_URL } from "../../../../utils";
import LoadingRing from "../../../../components/UI/Loading/ring";

const AddPostButton = () => {
  const { user, userPlan } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [colorTop, setColorTop] = useState("#FF9500");
  const [colorBot, setColorBot] = useState("#FF2D95");
  const [colorText, setColorText] = useState("#FFFFFF");
  const [type, setType] = useState("background");
  const [isLoading, setIsLoading] = useState(false); // thêm state loading

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading) return; // tránh gửi nhiều lần

    setIsLoading(true); // bật loading khi bắt đầu gửi

    const postData = {
      uid: user.uid,
      options: {
        caption,
        color_top: colorTop,
        color_bottom: colorBot,
        color_text: colorText,
        type: type,
      },
      user_info: {
        username: user.username,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        plan: userPlan?.plan_info?.name || "Free",
      },
    };

    axios
      .post(API_URL.CAPTION_POSTS_URL, postData)
      .then((response) => {
        showSuccess("Bài viết đã được thêm thành công! 🎉");

        // Reset form
        setCaption("");
        setColorTop("#FF9500");
        setColorBot("#FF2D95");
        setColorText("#FFFFFF");
        setType("background");
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        const serverMsg =
          error.response?.data?.error ||
          "Có lỗi xảy ra khi gửi bài viết. Vui lòng thử lại!";
        showError(serverMsg);
      })
      .finally(() => {
        setIsLoading(false); // tắt loading khi xong
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
            <h2 className="text-xl font-semibold">Chia sẻ caption theme</h2>
            <button
              className="flex items-center justify-center rounded-md w-11 h-11 bg-base-300"
              type="button"
              onClick={() => setShowForm(false)}
              disabled={isLoading} // disable khi loading
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
                  disabled={isLoading} // disable khi loading
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
                  disabled={isLoading} // disable khi loading
                >
                  <option value="background">Mặc định</option>
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
                    disabled={isLoading} // disable khi loading
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium">Color Bot</label>
                  <input
                    type="color"
                    className="mt-1 w-10 h-10 border rounded-sm"
                    value={colorBot}
                    onChange={(e) => setColorBot(e.target.value)}
                    disabled={isLoading} // disable khi loading
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium">Color Text</label>
                  <input
                    type="color"
                    className="mt-1 w-10 h-10 border rounded-sm"
                    value={colorText}
                    onChange={(e) => setColorText(e.target.value)}
                    disabled={isLoading} // disable khi loading
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

            <div className="mb-4 relative">
              <p className="absolute">Chỉ bấm gửi một lần tránh spam</p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`p-2 rounded-md text-white ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingRing size={18} stroke={2} color="white" /> Đang tải
                    lên
                  </>
                ) : (
                  "Thêm Caption"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPostButton;
