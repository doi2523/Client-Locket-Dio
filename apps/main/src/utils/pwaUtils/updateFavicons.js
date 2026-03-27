export function updateFavicons(iconName = "default") {
  const base = window.location.origin;

  const icons = [
    {
      rel: "icon",
      sizes: "16x16",
      href: `${base}/icons/${iconName}/favicon-16x16.png`,
    },
    {
      rel: "icon",
      sizes: "32x32",
      href: `${base}/icons/${iconName}/favicon-32x32.png`,
    },
    {
      rel: "icon",
      sizes: "96x96",
      href: `${base}/icons/${iconName}/favicon-96x96.png`,
    },
    {
      rel: "apple-touch-icon",
      href: `${base}/icons/${iconName}/apple-touch-icon.png`,
    },
  ];

  icons.forEach(({ rel, sizes, href }) => {
    let link = document.querySelector(
      `link[rel='${rel}']${sizes ? `[sizes='${sizes}']` : ""}`,
    );

    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      if (sizes) link.sizes = sizes;
      document.head.appendChild(link);
    }

    link.href = href;
  });
}