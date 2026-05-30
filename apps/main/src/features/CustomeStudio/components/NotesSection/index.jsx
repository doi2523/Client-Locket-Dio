import { Link } from "react-router-dom";

const notes = [
  {
    label: "Theo dõi cập nhật tại",
    text: "Telegram",
    href: "https://t.me/ddevdio",
    external: true,
  },
  {
    label: "Tham gia cộng đồng trên",
    text: "Discord",
    href: "https://discord.gg/47buy9nMGc",
    external: true,
  },
  {
    label: "Tham gia cộng đồng trên",
    text: "Messenger",
    href: "https://m.me/cm/AbYPtgRiGe2fInEf",
    external: true,
  },
  {
    label: "Ủng hộ dự án tại",
    text: "Trang Nhà tài trợ",
    href: "/sponsors",
    external: false,
  },
  {
    label: "Tham khảo mã nguồn tại",
    text: "GitHub",
    href: "https://github.com/doi2523/Client-Locket-Dio",
    external: true,
  },
];

const NotesSection = () => {
  return (
    <div className="px-4">
      <h2 className="text-md font-semibold text-primary mb-3">✏️ Ghi chú</h2>

      <div className="flex flex-wrap gap-4 text-base-content">
        {notes.map((item) => (
          <p key={item.href}>
            {item.label}{" "}
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold underline hover:text-primary-focus"
              >
                {item.text}
              </a>
            ) : (
              <Link
                to={item.href}
                className="text-primary font-semibold underline hover:text-primary-focus"
              >
                {item.text}
              </Link>
            )}
          </p>
        ))}
      </div>
    </div>
  );
};

export default NotesSection;
