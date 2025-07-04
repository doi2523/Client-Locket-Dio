import React from "react";

const ClearDataPage = () => {
  const handleClearAll = () => {
    // Xoá localStorage & sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Xoá cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });

    // Xoá cache của Service Worker (caches API)
    if ("caches" in window) {
      caches.keys().then((names) => {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }

    alert("Đã xoá toàn bộ dữ liệu trình duyệt!");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-red-600">
          Xoá toàn bộ dữ liệu trang web
        </h1>
        <button
          onClick={handleClearAll}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg transition duration-200"
        >
          Xoá toàn bộ
        </button>
      </div>
    </div>
  );
};

export default ClearDataPage;
