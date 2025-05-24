import { useContext, useEffect, useRef, useState } from "react";
import { useApp } from "../../../context/AppContext";
import { AuthContext } from "../../../context/AuthLocket";

const FriendsTab = () => {
  const popupRef = useRef(null);
  const { navigation } = useApp();
  const { isFriendsTabOpen, setFriendsTabOpen } = navigation;

  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Khi mở tab thì reset trạng thái kéo
  useEffect(() => {
    if (isFriendsTabOpen) {
      document.body.classList.add("overflow-hidden");
      setCurrentY(0);
    } else {
      document.body.classList.remove("overflow-hidden");
      setCurrentY(0);
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isFriendsTabOpen]);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || startY === null) return;
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startY;
  
    if (deltaY > 0) {
      const maxDrag = window.innerHeight * 0.86; // tương đương h-[86vh]
      setCurrentY(Math.min(deltaY , maxDrag));
    }
  };
  

  const handleTouchEnd = () => {
    const popupHeight = window.innerHeight * 0.86;
    const halfway = popupHeight / 2;
  
    if (currentY > halfway) {
      setFriendsTabOpen(false); // Đóng nếu kéo quá nửa popup
    } else {
      setCurrentY(0); // Kéo chưa đủ → trở lại vị trí cũ
    }
  
    setIsDragging(false);
    setStartY(null);
  };
  

  const translateStyle = {
    transform: `translateY(${isFriendsTabOpen ? currentY : window.innerHeight}px)`,
    transition: isDragging ? "none" : "transform 0.3s ease-out",
  };

  return (
    <div
      className={`fixed inset-0 z-90 flex justify-center items-end ${
        isFriendsTabOpen ? "" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-300 ${
          isFriendsTabOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setFriendsTabOpen(false)}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className={`
          w-full h-[86vh] bg-base-100 rounded-t-4xl shadow-lg flex flex-col
          will-change-transform
        `}
        style={translateStyle}
      >
        {/* Drag Handle */}
        <div
          className="w-full flex justify-center pt-3 pb-2 active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-start flex-col items-center px-4 pb-2 text-primary">
          <div className="flex items-center space-x-2 justify-center w-full no-select">
            <h2 className="text-2xl font-semibold">❤️‍🔥 ?? người bạn</h2>
          </div>
          <input
            type="text"
            className="input w-full mt-2"
            placeholder="Tìm kiếm bạn bè..."
          />
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="flex justify-start items-center gap-3">
            <img
              src="./prvlocket.png"
              alt=""
              className="w-16 h-16 rounded-full border-[3.5px] p-0.5 border-amber-400"
            />
            <div>
              <h2 className="font-medium">Name User</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default FriendsTab;
