//API chính cho toàn bộ website
// VITE_BASE_API_URL=https://apilocket-diov2.onrender.com
export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

//API lấy dữ liệu từ máy chủ
// VITE_BASE_API_URL_DB=https://api.admin.locket-dio.space
export const BASE_DB_API_URL = import.meta.env.VITE_BASE_API_URL_DB;

// Link tạo yêu cầu tải file lên Cloud
// VITE_STORAGE_API_URL=https://storage.locket-dio.space
export const STORAGE_API_URL = import.meta.env.VITE_STORAGE_API_URL;

//Link xem trước và tải media hoặc là đường dẫn truy cập
// VITE_MEDIA_API_URL=https://media.locket-dio.space
export const MEDIA_API_URL = import.meta.env.VITE_MEDIA_API_URL;

//Link api thanh toán
export const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_API_URL;
