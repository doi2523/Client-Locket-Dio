import { useEffect, useRef } from "react";

function resizeAppleCover(url, size = 64) {
  if (!url || typeof url !== "string") return "";

  return url.replace(/\/\d+x\d+bb(\.(jpg|png))?$/, `/${size}x${size}bb.jpg`);
}

export function MusicPlayer({
  thumbnail,
  payload,
  isVisible = true, // 👈 thêm
}) {
  const audioRef = useRef(null);

  // 🎧 Media Session
  useEffect(() => {
    if (!("mediaSession" in navigator) || !isVisible) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: payload?.song_title,
      artist: payload?.artist,
      album: payload?.album,

      artwork: [
        {
          src: resizeAppleCover(thumbnail, 96),
          sizes: "96x96",
          type: "image/jpeg",
        },

        {
          src: resizeAppleCover(thumbnail, 256),
          sizes: "256x256",
          type: "image/jpeg",
        },

        {
          src: resizeAppleCover(thumbnail, 512),
          sizes: "512x512",
          type: "image/jpeg",
        },
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
  }, [payload, thumbnail, isVisible]);

  // ▶️ Audio Logic
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    // ❌ không visible -> pause
    if (!isVisible) {
      audio.pause();
      return;
    }

    // ❌ không có nhạc
    if (!payload?.preview_url) {
      return;
    }

    audio.src = payload.preview_url;
    audio.loop = true;
    audio.volume = 1;

    audio.play().catch(() => {});

    return () => {
      audio.pause();

      audio.removeAttribute("src");

      audio.load();
    };
  }, [payload?.preview_url, isVisible]);

  return <audio ref={audioRef} className="hidden" />;
}
