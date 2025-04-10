import React from "react";

const DevCustomes = ({ onSelect }) => {
  const customePresets = [
  { id: "locket_times", top: "#FFDEE9", bottom: "#B5FFFC", caption: "📸 Locket Time!", text: "#202020E6" },
  { id: "snake_vibes", top: "#A8E063", bottom: "#56AB2F", caption: "🐍 Snake Vibes", text: "#1F1F1FE6" },
  { id: "coffee_time", top: "#4B2C20", bottom: "#B48E72", caption: "☕ Coffee Time!", text: "#FFFFFFE6" },
  { id: "feeling_cute", top: "#FF6A88", bottom: "#FFB199", caption: "🌷 Feeling Cute", text: "#FFFFFFE6" },
  { id: "sunset_vibes", top: "#FF758C", bottom: "#FF7EB3", caption: "🌇 Sunset Vibes", text: "#FFFFFFE6" },
  { id: "flight_times", top: "#2196f3", bottom: "#6dd5ed", caption: "🛫 Flight Time!", text: "#FFFFFFE6" },
  { id: "photo_times", top: "#F7BB97", bottom: "#DD5E89", caption: "📷 Photo Time!", text: "#FFFFFFE6" },
  { id: "day_dream", top: "#FAD0C4", bottom: "#FFD1FF", caption: "🌤 Daydream", text: "#101010E6" },
  { id: "dating_times", top: "#FF9A9E", bottom: "#F6416C", caption: "💕 Dating Time!", text: "#FFFFFFE6" },
  { id: "mixue_times", top: "#E0F7FA", bottom: "#FFCDD2", caption: "🍦 Mixue Time!", text: "#4E0000E6" }
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

export default DevCustomes;
