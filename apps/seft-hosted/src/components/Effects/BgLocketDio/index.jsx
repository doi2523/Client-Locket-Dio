export default function BgLocketDio({ bgSrc }) {
  if (!bgSrc) return null;

  const isVideo = bgSrc.endsWith(".mp4") || bgSrc.endsWith(".webm");

  if (isVideo) {
    return (
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={bgSrc} type="video/mp4" />
      </video>
    );
  }

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgSrc})` }}
    />
  );
}
