import { useEffect, useRef } from "react";

function resizeAppleCover(url, size = 64) {
  if (!url || typeof url !== "string") return "";
  return url.replace(/\/\d+x\d+bb(\.(jpg|png))?$/, `/${size}x${size}bb.jpg`);
}

export function MusicPlayer({ music }) {
  const audioRef = useRef(null);

  // 🎧 Setup Media Session
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: music?.title,
      artist: music?.artist,
      album: music?.album,
      artwork: [
        { src: resizeAppleCover(music.image, 96), sizes: "96x96", type: "image/jpeg" },
        { src: resizeAppleCover(music.image, 256), sizes: "256x256", type: "image/jpeg" },
        { src: resizeAppleCover(music.image, 512), sizes: "512x512", type: "image/jpeg" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });

    return () => {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [music]);

  // ▶️ Play music
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !music?.previewUrl) return;

    audio.src = music.previewUrl;
    audio.loop = true;
    audio.volume = 1;

    audio.play().catch(() => {});

    // 🧹 Cleanup cực kỳ quan trọng
    return () => {
      audio.pause();
      audio.removeAttribute("src"); // giải phóng memory
      audio.load(); // reset audio
    };
  }, [music?.previewUrl]);

  return <audio ref={audioRef} className="hidden" />;
}