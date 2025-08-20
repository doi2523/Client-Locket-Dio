import { useContext, useState } from "react";
import LoadingRing from "@/components/ui/Loading/ring";
import { AuthContext } from "@/context/AuthLocket";

const Avatar = () => {
  const { user } = useContext(AuthContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`w-10 h-10 rounded-full shadow-md flex justify-center items-center backdrop-blur-md`}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingRing size={40} stroke={2} color="blue" />
        </div>
      )}
      <img
        src={user?.profilePicture || "/prvlocket.png"}
        alt="Profile"
        className={`w-full h-full rounded-full border-[2.5px] p-0.5 border-amber-400 object-cover transition-all duration-200 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};

export default Avatar;
