// storageUtils.js
export const clearAllLocalData = () => {
    try {
      // Xoá localStorage
      localStorage.clear();
  
      // Xoá sessionStorage
      sessionStorage.clear();
  
      // Xoá tất cả cookie (path = "/")
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    } catch (e) {
      console.error("❌ Lỗi khi xoá dữ liệu local:", e);
    }
  };
  