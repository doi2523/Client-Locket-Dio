import React from "react";
import { Link } from "react-router-dom";
import { LogOut, LogIn } from "lucide-react";

export const AuthButton = ({ user, onLogout, onClose }) => (
  <div className="flex-shrink-0 p-4 border-t border-base-300 sticky bottom-0 z-10">
    {user ? (
      <button
        className="flex items-center justify-center w-full px-4 py-5 text-base rounded-4xl btn btn-outline btn-error gap-2 font-semibold"
        onClick={() => {
          onLogout();
          onClose();
        }}
      >
        <LogOut size={20} /> Đăng xuất
      </button>
    ) : (
      <Link
        to="/login"
        className="flex items-center gradient-effect justify-center w-full px-4 py-5 text-base rounded-4xl btn gap-2 font-semibold text-white"
        onClick={onClose}
      >
        <LogIn size={20} /> Đăng nhập
      </Link>
    )}
  </div>
);
