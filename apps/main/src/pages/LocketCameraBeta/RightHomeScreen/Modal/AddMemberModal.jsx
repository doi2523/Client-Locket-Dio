import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Plus, Users } from "lucide-react";
import { SonnerInfo } from "@/components/ui/SonnerToast";
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
      setTimeout(() => setShowModal(false), 300);
    }
  }, [open]);

  const filteredFriends = availableFriends.filter((f) => {
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
        className={`fixed h-4/5 text-base-content bottom-0 border-t border-base-300 left-0 w-full p-4 bg-base-100 rounded-t-4xl shadow-lg transition-all duration-500 z-[71] flex flex-col
        ${animate ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-center mb-2">
          Thêm vào nhóm
        </h3>
        <div className="mb-3">
          <SearchInput
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            placeholder="Tìm bạn bè..."
          />
        </div>

        {/* grid list */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.length === 0 ? (
            <p className="text-center text-sm text-base-content/40 mt-4">
              Không có bạn bè phù hợp
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredFriends.map((friend) => {
                const isLoading = loadingAction === `add_${friend.uid}`;

                return (
                  <div
                    key={friend.uid}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-base-200 transition"
                  >
                    {/* avatar */}
                    <div className="relative">
                      {friend.profilePic ? (
                        <img
                          src={friend.profilePic}
                          className="w-14 h-14 rounded-full object-cover border border-base-300"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* name */}
                    <span className="text-xs font-medium text-center line-clamp-1">
                      {friend.firstName || friend.username}
                    </span>

                    {/* button */}
                    <button
                      onClick={() => {
                        SonnerInfo("Đang thêm...");
                        onAddMember(friend.uid);
                      }}
                      className="btn btn-primary btn-xs rounded-full w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <>
                          <Plus size={12} />
                          Thêm
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddMemberModal;
