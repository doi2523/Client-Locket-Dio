export function setPWAIcon(iconName = "default", path = "pwa-icons") {
  const base = window.location.origin;

  const manifest = {
    name: "Locket Dio",
    short_name: "Locket Dio",
    description: "Locket Dio - Đăng ảnh & Video lên Locket",
    display: "standalone",
    scope: base + "/",
    start_url: base,
    orientation: "portrait",
    icons: [
      {
        src: `${base}/${path}/${iconName}/android-chrome-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${base}/${path}/${iconName}/android-chrome-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${base}/${path}/${iconName}/maskable-icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  const blob = new Blob([JSON.stringify(manifest)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  let link = document.querySelector("link[rel='manifest']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.appendChild(link);
  }

  link.href = url;
}