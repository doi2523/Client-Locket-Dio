import React, { useContext, useEffect, useState } from "react";
import { VideoIcon, Wrench, Settings2, Users } from "lucide-react";
import {
  fetchUserPlan,
  getListRequestFriend,
  rejectMultipleFriendRequests,
} from "../../../services";
import { AuthContext } from "../../../context/AuthLocket";
import { showError, showInfo, showSuccess } from "../../../components/Toast";
import { API_URL } from "../../../utils";
import LoadingRing from "../../../components/UI/Loading/ring";

const SESSION_KEY = "invites_session";

// Component riêng xử lý logic lời mời
function DeleteFriendsTool() {
  const { user, userPlan, setUserPlan, authTokens } = useContext(AuthContext);
  const [invites, setInvites] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserPlan().then((data) => {
      if (data) {
        setUserPlan(data);
      }
    });
  }, []);
  // Load từ sessionStorage khi component mount
  useEffect(() => {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setInvites(parsed.invites || []);
        setNextPageToken(parsed.nextPageToken || null);
      } catch (err) {
        console.error("Failed to parse session data", err);
      }
    }
  }, []);

  // Cập nhật sessionStorage mỗi khi invites thay đổi
  useEffect(() => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ invites, nextPageToken })
    );
  }, [invites, nextPageToken]);

  const handleFetchInvites = async () => {
    if (!user?.idToken || !user?.localId) {
      showInfo("⚠️ Bạn chưa đăng nhập hợp lệ.");
      return;
    }

    // Kiểm tra quyền với plan_id tương ứng
    // const allowedPlans = ["pro", "premium", "pro_plus"];
    // if (!userPlan?.plan_id || !allowedPlans.includes(userPlan.plan_id)) {
    //   alert(
    //     "Bạn không có quyền sử dụng tính năng này. Vui lòng nâng cấp lên gói Pro để mở khóa."
    //   );
    //   return;
    // }

    setLoading(true);
    const res = await getListRequestFriend();

    if (res.errorMessage) {
      showError(res.errorMessage);
      setLoading(false);
      return;
    }

    setInvites(res.friends || []);
    setNextPageToken(res.nextPageToken);
    setLoading(false);

    showSuccess(`Đã tải ${res.friends.length} lời mời!`);
  };

  const handleLoadMore = async () => {
    if (!nextPageToken || !user?.idToken || !user?.localId) return;

    setLoading(true);
    const res = await getListRequestFriend(
      user.idToken,
      user.localId,
      nextPageToken
    );
    setInvites((prev) => [...prev, ...(res.friends || [])]);
    setNextPageToken(res.nextPageToken);
    setLoading(false);
  };

  const handleDeleteBatch = async () => {
    const batch = invites.slice(0, 50);
    if (batch.length === 0) {
      showInfo("📭 Không còn lời mời để xoá.");
      return;
    }

    setDeleting(true);

    try {
      const uidList = batch.map((invite) => invite.uid);
      const data = await rejectMultipleFriendRequests(uidList);

      const successCount = data?.successCount ?? batch.length;

      showSuccess(`🧹 Đã xoá ${successCount}/${batch.length} lời mời.`);

      // Cập nhật lại danh sách invites
      setInvites((prev) =>
        prev.filter((invite) => !uidList.includes(invite.uid))
      );
    } catch (error) {
      showError("❌ Xoá lời mời thất bại: " + error.message);
    }

    setDeleting(false);
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Xoá lời mời không mong muốn{" "}
          <span className="badge badge-sm badge-secondary">Hot</span>
        </h2>
        <p>
          🎯 Công cụ này giúp bạn xoá lời mời kết bạn spam từ bạn bè một cách tự
          động. Tính năng này chỉ áp dụng cho Pro, Premium, Pro Plus
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <button
          onClick={handleFetchInvites}
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading && <LoadingRing size={20} stroke={2} color="white" />}
          {loading ? "Đang tải..." : "📥 Lấy danh sách lời mời"}
        </button>

        {invites.length > 0 && (
          <>
            <div className="text-sm text-base-content">
              Đã tìm thấy <strong>{invites.length}</strong> lời mời kết bạn.
            </div>

            <ul className="bg-base-100 border rounded-lg p-4 max-h-48 overflow-auto text-sm space-y-2">
              {invites.map((invite, idx) => (
                <li key={idx}>
                  👤 <code>{invite.uid}</code>{" "}
                  <span className="text-xs opacity-60">
                    ({new Date(invite.date).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>

            {nextPageToken && (
              <button
                onClick={handleLoadMore}
                className="btn btn-outline w-full"
                disabled={loading}
              >
                {loading ? "Đang tải thêm..." : "📄 Tải thêm lời mời"}
              </button>
            )}

            <button
              onClick={handleDeleteBatch}
              className="btn btn-error w-full"
              disabled={deleting}
            >
              {deleting ? "Đang xoá..." : `🗑️ Xoá 50 lời mời`}
            </button>
          </>
        )}
      </div>
    </>
  );
}
const toolsList = [
  {
    key: "delete_friends",
    label: "Xoá lời mời Spam",
    icon: <Users />,
    content: <DeleteFriendsTool />,
  },
  {
    key: "convert",
    label: "Chuyển Đổi File",
    icon: <VideoIcon />,
    content: (
      <div>
        🎥 Công cụ giúp bạn chuyển đổi định dạng video và ảnh sang định dạng phổ
        biến hơn.
      </div>
    ),
  },
  {
    key: "editor",
    label: "Chỉnh Sửa Ảnh",
    icon: <Wrench />,
    content: <div>🖌️ Dễ dàng cắt ảnh, thêm sticker và filter yêu thích.</div>,
  },
  {
    key: "settings",
    label: "Cài Đặt",
    icon: <Settings2 />,
    content: (
      <div>⚙️ Tùy chỉnh giao diện, bảo mật và trải nghiệm người dùng.</div>
    ),
  },
];

function BottomToolBar({ tools, activeKey, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 shadow-md flex justify-around py-3 z-50 md:hidden">
      {tools.map((tool) => (
        <button
          key={tool.key}
          onClick={() => onChange(tool.key)}
          className={`flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200
            ${
              activeKey === tool.key
                ? "text-primary"
                : "text-base-content/70 hover:text-primary"
            }`}
          aria-label={tool.label}
          title={tool.label}
          type="button"
        >
          {React.cloneElement(tool.icon, { size: 22 })}
          <span className="mt-1">{tool.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function ToolsLocket() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(toolsList[0].key);

  return (
    <div className="flex flex-col min-h-screen w-full bg-base-200 pb-16 md:pb-0">
      <div className="h-16"></div>

      <h1 className="text-3xl font-bold mb-4 pt-6 text-primary text-center">
        🧰 ToolsLocket by Dio
      </h1>

      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-4 gap-6 py-3">
        <div className="hidden md:block w-1/4">
          <div className="flex flex-col gap-2">
            {toolsList.map((tool) => (
              <button
                key={tool.key}
                onClick={() => setActiveTab(tool.key)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-medium border shadow-sm transition-all 
                ${
                  activeTab === tool.key
                    ? "bg-primary text-white border-primary"
                    : "bg-base-100 text-base-content hover:bg-base-100 hover:shadow-md"
                }`}
              >
                {tool.icon}
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-3/4 bg-base-100 border border-base-300 p-6 rounded-2xl shadow">
          {toolsList.find((t) => t.key === activeTab)?.content || (
            <div>🔍 Không tìm thấy nội dung</div>
          )}
        </div>
      </div>

      <div className="text-sm text-center mb-6 text-base-content">
        Đăng nhập dưới tên:{" "}
        <strong>
          {user?.firstName} {user?.lastName}
        </strong>
      </div>

      <BottomToolBar
        tools={toolsList}
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}
