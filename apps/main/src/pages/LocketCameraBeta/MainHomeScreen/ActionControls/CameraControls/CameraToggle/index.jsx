import { isIOS } from "@/utils";
import CameraToggleAndroid from "./Android";
import CameraToggleIOS from "./IOS";

const CameraToggle = isIOS() ? CameraToggleIOS : CameraToggleAndroid;

export default CameraToggle;
