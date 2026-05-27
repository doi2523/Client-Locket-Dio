import { isIOS } from "@/utils";
import MediaPreviewAndroid from "./Android";
import MediaPreviewIOS from "./IOS";

const MediaPreview = isIOS() ? MediaPreviewIOS : MediaPreviewAndroid;

export default MediaPreview;
