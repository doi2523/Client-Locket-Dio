const DisableFeature = ({
  toolName = "Tính năng",
  description = "Để mở khóa vui lòng liên hệ admin để được trợ giúp.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <div className="text-6xl">🔒</div>

      <h3 className="text-xl font-semibold">Tính năng bị chặn</h3>

      <p className="text-sm opacity-70 max-w-md">
        Bạn không có quyền truy cập vào <b>{toolName}</b>. {description}
      </p>

      <p className="text-sm opacity-70 max-w-md">
        <span className="block">
          • Vì sao lại bị khoá? Mình cảm thấy người dùng chưa thực sự hiểu vấn
          đề. Nên mình nghĩ khoá hẳn tính năng này sẽ tốt hơn.
        </span>
        <span className="block">
          • Làm cách nào để mở lại? Hãy liên hệ quản trị viên website này.
        </span>
        <span className="block">
          • Tính năng này chỉ đi theo tài khoản mà bạn cung cấp với quản trị
          viên.
        </span>
        <span className="block">
          • Bạn cần hỗ trợ? Nó không ở đây đâu hãy truy cập mục Liên Hệ và Hỗ
          trợ.
        </span>
      </p>
    </div>
  );
};

export default DisableFeature;
