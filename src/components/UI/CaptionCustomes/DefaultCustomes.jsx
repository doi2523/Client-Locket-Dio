import React from "react";

const DefaultCustomes = ({ onSelect }) => {
  const customePresets = [
    // { id: "galaxy", top: "#5733FF", bottom: "#FF33B5", caption: "Galaxy", text: "#FFFFFF" },
    { id: "good_morning", top: "#EF7402", bottom: "#EABF0F", caption: "☀️ Good Morning", text: "#FFFFFFE5" },//Done
    { id: "goodnight", top: "#370C6F", bottom: "#575CD4", caption: "🌙 Goodnight", text: "#FFFFFFE6" },
    { id: "party_time", top: "#FCFF57", bottom: "#5EFFF5", caption: "🪩 Party Time!", text: "#000000E6" }, //Done
    { id: "ootd", top: "#FFFFFF", bottom: "#DBDBDB", caption: "🕶 OOTD", text: "#101010E6" }, //Done
    { id: "miss_you", top: "#EC0C00", bottom: "#FF493F", caption: "🥰 Miss you", text: "#FFFFFFDB" },
    { id: "easter_2025", caption: "🐣 Happy Easter!", top: "#FFFD89", bottom: "#FFDA58", text: "#E24B6C" },
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
            onSelect(custome.id, custome.top, custome.bottom, custome.caption, custome.text)
          }
        >
          <span className="text-base">{custome.caption}</span>
        </button>
      ))}
    </div>
  );
};

export default DefaultCustomes;
