import React from "react";

const ColorSuggestions = ({ onSelect }) => {
  const customePresets = [
    { id: "galaxy", top: "#5733FF", bottom: "#FF33B5", caption: "Caption", text: "#FFFFFF" },
    { id: "sunset", top: "#FF5733", bottom: "#FFC300", caption: "Caption", text: "#FFFFFF" },
    { id: "aqua_fresh", top: "#33FF57", bottom: "#33CFFF", caption: "Caption", text: "#FFFFFF" },
    { id: "mint_breeze", top: "#FF5733", bottom: "#33FFC3", caption: "Caption", text: "#FFFFFF" },
    { id: "peachy", top: "#FF9500", bottom: "#FF2D95", caption: "Caption", text: "#FFFFFF" },
    { id: "cotton_candy", top: "#00B5FF", bottom: "#FFB6C1", caption: "Caption", text: "#FFFFFF" },
  ];

  return (
    <div className="flex flex-wrap gap-4 pt-2 pb-5 justify-start">
      {customePresets.map((custome) => (
        <button
          key={custome.id}
          className="flex flex-col whitespace-nowrap items-center space-y-1 py-2 px-4 btn h-auto w-auto rounded-3xl font-semibold justify-center"
          style={{
            background: `linear-gradient(to top, ${custome.top}, ${custome.bottom})`,
            color: custome.text,
          }}
          onClick={() =>
            onSelect(
              "custome",
              custome.top,
              custome.bottom,
              "",
              custome.text
            )
          }
        >
          <span className="text-base">{custome.caption}</span>
        </button>
      ))}
    </div>
  );
};

export default ColorSuggestions;
