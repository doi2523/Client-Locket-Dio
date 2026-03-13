import { Link } from "react-router-dom";

/**
 * Hiển thị danh sách block nội dung bài viết
 * Các loại block hỗ trợ: text, heading, quote, list, html, image, images-row,
 * video, embed, button, overlay, divider
 */
export default function NewsContentBlocks({ blocks = [], title }) {
  if (!blocks?.length) return null;

  return (
    <div className="prose prose-slate max-w-none">
      {blocks.map((block, idx) => {
        const key = idx;
        const cls = block.className || "";

        switch (block.type) {
          // === TEXT ===
          case "text": {
            const Tag = block.tag || "p";
            return (
              <Tag key={key} className={cls}>
                {block.data}
                {block.link && (
                  <Link
                    to={block.link.href}
                    className="text-blue-600 underline ml-1 hover:text-blue-800"
                  >
                    {block.link.text}
                  </Link>
                )}
              </Tag>
            );
          }

          // === HEADING ===
          case "heading": {
            const level = Math.min(Math.max(block.level || 2, 1), 4);
            const Tag = `h${level}`;
            return (
              <Tag
                key={key}
                className={`font-semibold mt-6 mb-2 ${cls}`}
              >
                {block.data}
              </Tag>
            );
          }

          // === QUOTE ===
          case "quote":
            return (
              <blockquote
                key={key}
                className={`border-l-4 border-blue-400 pl-4 italic text-slate-700 my-4 ${cls}`}
              >
                “{block.data}”
                {block.author && (
                  <footer className="text-sm text-slate-500 mt-1">
                    — {block.author}
                  </footer>
                )}
              </blockquote>
            );

          // === LIST ===
          case "list": {
            const isOrdered = block.ordered ?? false;
            const Tag = isOrdered ? "ol" : "ul";
            return (
              <Tag
                key={key}
                className={`my-4 pl-5 ${
                  isOrdered ? "list-decimal" : "list-disc"
                } ${cls}`}
              >
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </Tag>
            );
          }

          // === HTML ===
          case "html":
            return (
              <div
                key={key}
                className={cls}
                dangerouslySetInnerHTML={{ __html: block.data }}
              />
            );

          // === IMAGE ===
          case "image":
            return (
              <div key={key} className={`my-4 text-center`}>
                <img
                  src={block.data}
                  alt={block.caption || title}
                  className={`my-4 text-center ${cls}`}
                />
                {block.caption && (
                  <p className="text-sm text-slate-500 mt-1">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          // === MULTIPLE IMAGES (ROW) ===
          case "images-row":
            return (
              <div
                key={key}
                className={`flex flex-wrap gap-4 my-4 justify-center ${cls}`}
              >
                {block.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.data}
                    alt={img.caption || title}
                    className={img.className || "rounded-2xl shadow-md max-h-64"}
                  />
                ))}
              </div>
            );

          // === VIDEO ===
          case "video":
            return (
              <div key={key} className={`my-6 text-center ${cls}`}>
                <video
                  controls
                  src={block.src}
                  poster={block.poster}
                  className="w-full rounded-2xl shadow-md max-h-[480px]"
                />
                {block.caption && (
                  <p className="text-sm text-slate-500 mt-2">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          // === EMBED (iframe / YouTube) ===
          case "embed":
            return (
              <div key={key} className={`my-6 flex justify-center ${cls}`}>
                <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-2xl shadow-md">
                  <iframe
                    src={block.src}
                    title={block.title || "Embed"}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            );

          // === BUTTON ===
          case "button":
            return (
              <div key={key} className={`my-6 text-center ${cls}`}>
                <Link
                  to={block.href}
                  className={`inline-block px-5 py-2 rounded-xl font-medium shadow-md transition ${
                    block.variant === "primary"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {block.text}
                </Link>
              </div>
            );

          // === OVERLAY (Gradient Tag / Badge) ===
          case "overlay": {
            const colors = block.colors || ["#141414", "#444"];
            const textColor = block.textColor || "#fff";
            const background = `linear-gradient(${colors[0]}, ${colors[1]})`;

            return (
              <div
                key={key}
                className={`p-2 rounded-3xl font-semibold w-fit px-2 my-3 flex justify-center items-center ${cls}`}
                style={{ background }}
              >
                <span style={{ color: textColor }}>{block.data}</span>
              </div>
            );
          }

          // === DIVIDER ===
          case "divider":
            return (
              <div key={key} className={`flex my-6 justify-center ${cls}`}>
                <div className="w-full h-px bg-slate-200" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
