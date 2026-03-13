import { useEffect, useRef } from "react";

export function TestMusicPlayer({ music }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (
      music?.preview_url ||
      music?.preview_url?.[0] ||
      music?.previewUrl ||
      music?.audio
    ) {
      audioRef.current.src =
        music?.preview_url ||
        music?.preview_url?.[0] ||
        music?.previewUrl ||
        music?.audio;
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

function resizeAppleCover(url, size = 64) {
  if (!url || typeof url !== "string") return "";

  // Regex: tìm phần `/(\d+x\d+)(bb|bb\.jpg|bb\.png)`
  return url.replace(/\/\d+x\d+bb(\.(jpg|png))?$/, `/${size}x${size}bb.jpg`);
}

export function MusicPlayer({ music }) {
  const audioRef = useRef(null);

  // 🪄 Thiết lập Media Session (hiển thị thông tin bài hát trên hệ thống)
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: music?.title,
        artist: music?.artist,
        album: music?.album,
        artwork: [
          { src: resizeAppleCover(music.image, 512), sizes: "64x64", type: "image/jpeg" },
          { src: resizeAppleCover(music.image, 512), sizes: "128x128", type: "image/jpeg" },
        ],
      });

      // Có thể thêm hành động điều khiển media ở đây nếu muốn
      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
      });
    }
  }, []);

  // 🎧 Tự động phát nhạc khi mount
  useEffect(() => {
    if (music?.previewUrl && audioRef.current) {
      audioRef.current.src = music.previewUrl;
      audioRef.current
        .play()
        .then(() => {
          console.log("Đang phát:", music.title);
        })
        .catch((err) => {
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

