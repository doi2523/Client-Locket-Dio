import { useEffect, useRef } from "react";

export function MusicPlayer({ music }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (music?.preview_url?.[0]) {
      audioRef.current.src = music.preview_url[0];
      audioRef.current.play().catch((err) => {
        console.warn("Không thể tự phát nhạc:", err);
      });
    }
  }, [music]);

  return (
    <audio
      ref={audioRef}
      controls
      loop
      className="hidden" // ẩn nếu không muốn hiển thị thanh điều khiển
    />
  );
}
