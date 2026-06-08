import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Users } from "lucide-react";
import SearchInput from "@/components/ui/Input/SearchInput";

const AddMemberModal = ({
  open,
  onClose,
  availableFriends = [],
  onAddMember,
  loadingAction,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [selectedUid, setSelectedUid] = useState(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showModal]);

  useEffect(() => {
    if (open) {
      setShowModal(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => {
        setShowModal(false);
        setSelectedUid(null);
      }, 300);
    }
  }, [open]);

  const filteredFriends = availableFriends.filter((f) => {
    if (f.isCelebrity) return false;

    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();
    return (
      (f.firstName || "").toLowerCase().includes(q) ||
      (f.username || "").toLowerCase().includes(q)
    );
  });

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-base-100/30 backdrop-blur-[4px] transition-opacity duration-500 z-[70] ${
        animate ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed h-[90%] text-base-content bottom-0 left-0 w-full p-4 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 z-[71] flex flex-col
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-center mb-2">
          Thêm vào nhóm
        </h3>

        <p>Lưu ý: Người mới có thể xem các tin nhắn trước đó.</p>

        <div className="mb-3">
          <SearchInput
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            placeholder="Tìm bạn bè..."
          />
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto pb-16">
          {filteredFriends.length === 0 ? (
            <p className="text-center text-sm text-base-content/40 mt-4">
              Không có bạn bè phù hợp
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filteredFriends.map((friend) => {
                const isSelected = selectedUid === friend.uid;

                return (
                  <div
                    key={friend.uid}
                    onClick={() => setSelectedUid(friend.uid)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition
                      hover:bg-base-200 hover:scale-105
                      ${
                        selectedUid
                          ? selectedUid === friend.uid
                            ? "opacity-100"
                            : "opacity-50 blur-[0.3px]"
                          : "opacity-100"
                      }
                    `}
                  >
                    {/* avatar */}
                    <div
                      className={`relative rounded-full p-[2px] transition
                        ${isSelected ? "ring-3 ring-yellow-400" : "ring-0"}`}
                    >
                      {friend.profilePic ? (
                        <img
                          src={friend.profilePic}
                          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border border-base-300"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* name */}
                    <span className="text-xs font-medium text-center line-clamp-1">
                      {friend?.firstName} {friend?.lastName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="fixed bottom-0 left-0 w-full z-[80] p-4">
          <button
            className="btn btn-lg text-base font-semibold rounded-3xl w-full btn-neutral px-6 flex items-center justify-center gap-2"
            disabled={!selectedUid || loadingAction}
            onClick={() => {
              if (!selectedUid) return;
              onAddMember(selectedUid);
            }}
          >
            Thêm vào nhóm
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddMemberModal;
