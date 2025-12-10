import React from "react";
import { Link } from "react-router-dom";

const SavedCaptions = ({ title = "Caption của bạn", captions = [], onSelect }) => {
  const isLoading = !captions || captions.length === 0;

  return (
    <div className="px-4">
      {title && (
        <h2 className="text-md font-semibold text-primary mb-2">{title}</h2>
      )}

      <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
        {isLoading ? (
          <Link to={"/manage"} className="flex flex-row whitespace-nowrap items-center justify-center py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold">
            <img
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTJyaDUyNWkzYjBqaGwycDZ0cWpudmhqbjVkdnBub3hlYXZkMHJ5OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3gAO9yx102EYTUG5E6/giphy.gif"
              alt=""
              className="w-6 h-6"
            />
            <span className="text-base ml-2">Truy cập trang quản lý</span>
          </Link>
        ) : (
          captions.map((cap) => (
            <button
              key={cap.id}
              className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center shadow-md hover:shadow-lg transition"
              style={{
                background: `linear-gradient(to bottom, ${cap.colortop}, ${cap.colorbottom})`,
                color: cap.color || "#fff",
              }}
              onClick={() => onSelect(cap)}
            >
              <span className="text-base flex items-center gap-2">
                {cap.type === "image_icon" || cap.type === "image_gif" ? (
                  <img
                    src={cap.icon_url}
                    alt="icon"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <>{cap.icon_url}</>
                )}
                {cap.text}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedCaptions;
