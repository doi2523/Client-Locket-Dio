# 📸 Self-Hosted API Locket Dio

---

## 📖 Giới Thiệu

**Self-Hosted API Locket Dio** là một backend API được xây dựng bằng Node.js, phục vụ cho ứng dụng chia sẻ ảnh theo phong cách Locket Widget. Dự án cung cấp các endpoint để xử lý ảnh, quản lý người dùng và phân phối nội dung theo thời gian thực.

> 📚 Tài liệu API chi tiết: [API_DOCS.md](./API_DOCS.md)

## 📋 Yêu Cầu Hệ Thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Node.js | >= 18.0.0 |
| npm | >= 8.0.0 |
| yarn | >= 1.22.0 (tuỳ chọn) |
| Git | bất kỳ |

---

## 🚀 Bắt Đầu Nhanh

### 1. Clone repository

```bash
git clone -b self-hosted/locket-dio {{link_repo}}
cd apps/self-hosted/api
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Thiết lập môi trường

```bash
cp .env.example .env.development
```

Mở `.env.development` và điền các giá trị cần thiết.

### 4. Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
```

Truy cập [http://localhost:5001](http://localhost:5001) để kiểm tra server.

---

## 🛠️ Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy server ở chế độ development (nodemon) |
| `npm start` | Chạy server ở chế độ production |
| `npm test` | Chạy test suite |

---

## 📁 Cấu Trúc Dự Án

```
root/
│
├── src/
│   ├── config/          # Cấu hình app (database, env, cors...)
│   ├── controller/      # Xử lý logic request/response
│   ├── helpers/         # Hàm tiện ích dùng chung
│   ├── libs/            # Tích hợp thư viện bên thứ ba
│   ├── middlewares/     # Middleware (auth, error handler, rate limit...)
│   ├── routes/          # Định nghĩa các API route
│   ├── services/        # Business logic, tương tác database
│   └── utils/           # Utility functions (format, validate...)
│
├── .env.example         # Mẫu biến môi trường
├── .gitignore
├── app.js               # Entry point của ứng dụng
├── nodemon.json         # Cấu hình nodemon (hot reload)
├── package.json         # Danh sách dependencies và scripts
├── package-lock.json    # Khoá phiên bản package
├── API.md               # Tài liệu API chi tiết
└── README.md            # File này
```

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón!

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m "feat: mô tả thay đổi"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

Vui lòng tuân theo [Conventional Commits](https://www.conventionalcommits.org/) khi đặt tên commit.

---

<div align="center">

### ⭐ Hãy Star repository này nếu bạn thấy hữu ích!

**Được tạo với ❤️ bởi [Dio](https://github.com/doi2523) | © 2025 [Locket Dio](https://locket-dio.com) | Tất cả quyền được bảo lưu**

[![Về đầu trang](https://img.shields.io/badge/⬆️_Về_Đầu_Trang-Nhấn_Vào_Đây-blue?style=for-the-badge)](#-locket-dio)

</div>