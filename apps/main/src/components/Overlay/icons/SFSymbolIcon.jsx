const getSFSymbolUrl = (name, color = "#000") => {
  const encodedColor = encodeURIComponent(color);
  return `https://sfsymbols.vercel.app/s/${name}?color=${encodedColor}`;
};

const SFSymbolIcon = ({ data, color }) => {
  const url = getSFSymbolUrl(data, color);

  return <img src={url} alt={data} className="w-6 h-6 object-cover" />;
};

export default SFSymbolIcon;
