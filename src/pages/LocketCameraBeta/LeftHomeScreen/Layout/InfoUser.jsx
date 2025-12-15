import LoadingRing from "@/components/ui/Loading/ring";
import { Link } from "lucide-react";
import React from "react";

function InfoUser({ user }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <div className="flex flex-row justify-between items-center px-4 pb-2">
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold whitespace-nowrap">
          {user?.displayName || "Name"}
        </p>
        <a
          href={`https://locket.cam/${user?.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link underline font-semibold flex items-center"
        >
          @{user?.username} <Link className="ml-2" size={18} />
        </a>
      </div>
      <div className="avatar w-16 h-16 disable-select flex-shrink-0">
        <div className="rounded-full shadow-md border-3 border-amber-400 p-0.5">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingRing size={40} stroke={2} color="blue" />
            </div>
          )}
          <img
            src={user?.profilePicture || "/images/default_profile.png"}
            alt="Profile"
            className={`w-16 h-16 rounded-full transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = "/images/default_profile.png";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default InfoUser;
