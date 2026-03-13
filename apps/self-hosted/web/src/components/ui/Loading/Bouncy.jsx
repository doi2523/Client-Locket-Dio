import { bouncy } from "ldrs";

bouncy.register();

const BouncyLoader = ({ size = 45, speed = 1.75, color = "black" }) => {
  // Web components cần đăng ký 1 lần, nên thường ta để ngoài component
  return (
    <l-bouncy size={size} speed={speed} color={color}></l-bouncy>
  );
};

export default BouncyLoader;
