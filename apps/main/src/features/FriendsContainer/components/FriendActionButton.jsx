import { Plus, UserCheck } from "lucide-react";

export default function FriendActionButton({
  status = "NONE",
  loading = false,
  onAdd,
  onAccept,
  onReject,
  disabled = false,
}) {
  const baseClass =
    "flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition-all";

  const isDisabled = disabled || loading;

  // 👉 OUTGOING
  if (status === "OUTGOING") {
    return (
      <div className={`${baseClass} bg-gray-200 text-gray-500`}>
        {loading ? "Đang xử lý..." : "Đã gửi"}
      </div>
    );
  }

  // 👉 INCOMING
  if (status === "INCOMING") {
    return (
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="btn btn-success"
          disabled={isDisabled}
        >
          {loading ? "..." : "Chấp nhận"}
        </button>

        <button
          onClick={onReject}
          className="btn btn-error"
          disabled={isDisabled}
        >
          {loading ? "..." : "Từ chối"}
        </button>
      </div>
    );
  }

  // 👉 FRIENDS
  if (status === "FRIENDS") {
    return (
      <div className={`${baseClass} bg-primary text-white`}>
        <UserCheck className="w-5 h-5" />
        Bạn bè
      </div>
    );
  }

  // 👉 DEFAULT (NONE)
  return (
    <button
      onClick={onAdd}
      disabled={isDisabled}
      className={`${baseClass} ${
        isDisabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-yellow-500 text-black hover:bg-yellow-400"
      }`}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-xs" />
          Đang gửi
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          Kết bạn
        </>
      )}
    </button>
  );
}
