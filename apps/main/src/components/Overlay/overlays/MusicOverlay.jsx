import { useSelectedStore } from "@/stores";
import "./styles.css";
import { MusicPlayer } from "@/components/Widgets/MusicPlayer";

const MusicOverlay = ({ overlayData, momentId }) => {
  const selectedMomentId = useSelectedStore((s) => s.selectedMomentId);
  const music = overlayData?.payload || {};

  const text = overlayData?.text || "";
  const urlImage = overlayData?.icon?.data || "";

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex w-auto items-center gap-2 py-2 px-4 rounded-4xl text-white font-semibold bg-white/50 backdrop-blur-2xl max-w-[85%] overflow-hidden">
      <img
        src={urlImage}
        alt="Cover"
        className="w-6 h-6 object-cover rounded-sm shrink-0 no-select no-save"
      />

      <div className="relative overflow-hidden whitespace-nowrap flex-1">
        <div
          className="inline-block animate-marquee"
          style={{
            animationDuration:
              text.length < 30 ? "9s" : text.length < 60 ? "15s" : "17s",
          }}
        >
          <span className="mr-4">{text}</span>
          <span className="mr-4 absolute">{text}</span>
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

      <MusicPlayer
        thumbnail={urlImage}
        payload={music}
        isVisible={selectedMomentId === momentId}
      />
    </div>
  );
};

export default MusicOverlay;
