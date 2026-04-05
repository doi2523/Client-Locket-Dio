import { getBackgroundStyle } from "./getBackgroundStyle";
import { getTextStyle } from "./getTextStyle";

export function getCaptionStyle(background, textColor) {
  return {
    ...getBackgroundStyle(background),
    ...getTextStyle(textColor),
  };
}
