import EmojiIcon from "./EmojiIcon";
import ImageIcon from "./ImageIcon";
import SFSymbolIcon from "./SFSymbolIcon";

const ICON_COMPONENTS = {
  emoji: EmojiIcon,
  image: ImageIcon,
  sf_symbol: SFSymbolIcon,
};

function IconRenderer({ icon }) {
  if (!icon) return null;

  const Component = ICON_COMPONENTS[icon.type];
  if (!Component) return null;

  return <Component {...icon} />;
}

export default IconRenderer;
