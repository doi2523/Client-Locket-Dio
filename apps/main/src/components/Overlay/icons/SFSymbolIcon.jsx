const icons = import.meta.glob("/src/assets/sf-symbols/*.{png,svg}", {
  eager: true,
  import: "default",
});

const SFSymbolIcon = ({ data, className = "w-6 h-6 object-contain" }) => {
  const src =
    icons[`/src/assets/sf-symbols/${data}.svg`] ||
    icons[`/src/assets/sf-symbols/${data}.png`];

  if (!src) {
    console.warn(`Symbol "${data}" not found.`);

    return null;
  }

  return (
    <img
      src={src}
      alt={data}
      className={className}
      draggable={false}
      loading="lazy"
    />
  );
};

export default SFSymbolIcon;
