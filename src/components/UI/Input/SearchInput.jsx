// components/SearchInput.jsx
import React from "react";
import { MdSearch } from "react-icons/md";

export default function SearchInput({
  searchTerm,
  setSearchTerm,
  isFocused,
  setIsFocused,
  placeholder = "Tìm kiếm...",
}) {
  return (
    <div className="relative flex-1 w-full">
      <MdSearch className="w-6 h-6 absolute text-base-content z-10 left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <div
        className={`
          w-full transition-all duration-300 ease-in-out
          ${searchTerm.length === 0 && !isFocused ? "flex justify-center" : "flex justify-start"}
        `}
      >
        <input
          type="text"
          className={`
            text-base text-base-content rounded-4xl input input-ghost
            font-semibold bg-base-300 pl-12 p-6 pr-6 w-full max-w-full
            focus:outline-none focus:bg-base-300
            transition-all duration-300 ease-in-out
          `}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
}
