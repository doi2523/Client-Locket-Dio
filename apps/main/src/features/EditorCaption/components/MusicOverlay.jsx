import "./styles.css";

const MusicOverlay = ({ postOverlay }) => {
  const music = postOverlay?.payload || {};

  return (
    <div className="flex w-auto items-center gap-2 py-2 px-4 rounded-4xl text-white font-semibold bg-white/50 backdrop-blur-2xl max-w-[85%] overflow-hidden">
      <img
        src={music.image}
        alt="Cover"
        className="w-6 h-6 object-cover rounded-sm shrink-0 no-select no-save"
      />

      <div className="relative overflow-hidden whitespace-nowrap flex-1">
        <div
          className="inline-block animate-marquee"
          style={{
            animationDuration:
              postOverlay.text.length < 30
                ? "9s"
                : postOverlay.text.length < 60
                  ? "15s"
                  : "17s",
          }}
        >
          <span className="mr-4">{postOverlay.text}</span>
          <span className="mr-4 absolute">{postOverlay.text}</span>
        </div>
      </div>
      {/* ✅ Chỉ hiện icon nếu platform là spotify */}
      {music.platform === "spotify" && (
        <div className="flex items-center gap-2 shrink-0 no-select no-save">
          <div className="border-l border-white h-5"></div>
          <img
            src="./icons/spotify_icon.png"
            alt="Spotify Icon"
            className="w-6 h-6 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default MusicOverlay;
