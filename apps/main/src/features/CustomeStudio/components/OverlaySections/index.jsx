import { getCaptionStyle } from "@/helpers/styleHelpers";
import React from "react";

const CaptionSections = ({ sections, onSelect }) => {
  if (!sections) return null;

  return (
    <div className="space-y-6">
      {sections
        .filter((section) => section.active)
        .sort((a, b) => a.order_id - b.order_id)
        .map((section) => (
          <div key={section.section_id} className="px-4">
            {/* Section title */}
            <div className="flex flex-row gap-3 items-center mb-3">
              <h2 className="text-md font-semibold text-primary">
                {section.name}
              </h2>
              {section?.badge && (
                <div className="badge badge-sm badge-secondary">
                  {section?.badge || "Hot"}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-4 justify-start">
              {section.items
                .filter((item) => item.active)
                .sort((a, b) => a.order_id - b.order_id)
                .map((item, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => onSelect(item)}
                      className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
                      style={{
                        ...getCaptionStyle(item.background, item?.text_color),
                      }}
                    >
                      <span className="text-base flex items-center gap-1.5">
                        {/* Icon */}

                        {item.icon?.type === "emoji" && (
                          <span className="text-lg">{item.icon?.data}</span>
                        )}

                        {item.icon?.type === "image" && (
                          <img
                            src={item.icon?.data}
                            alt=""
                            className="w-5 h-5 object-contain"
                          />
                        )}

                        {/* Text fallback */}
                        {item.text || "Caption"}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CaptionSections;
