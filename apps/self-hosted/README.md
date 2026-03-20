# 🔒 Locket Dio – Self Hosted

Phiên bản chỉnh sửa của **Locket Client** để có thể **self-host (tự chạy server riêng)**.  
Project này tách riêng **frontend (web)** và **backend (api)** để có thể chạy độc lập và dễ chỉnh sửa hệ thống.

> ⚠️ **Lưu ý quan trọng**
>
> - Branch `main` là **bản gốc của project**
> - Các thay đổi để **self-host sẽ không commit vào `main`**
> - Nếu muốn chạy self-host bạn cần dùng branch:
>
> ```
> self-hosted/locket-dio
> ```

---

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Clone Project](#-clone-project)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Vận hành bằng Docker](#-vận-hành-bằng-docker)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
  - [Backend (API)](#1-backend-api)
  - [Frontend (Web)](#2-frontend-web)
- [Hướng dẫn Push Code](#-hướng-dẫn-push-code)
- [Quy tắc branch](#-quy-tắc-branch)
- [Góp ý & Báo lỗi](#-góp-ý--báo-lỗi)

---

## 💻 Yêu cầu hệ thống

| Công cụ | Phiên bản khuyến nghị |
|--------|----------------------|
| Node.js | >= 18.x |
| npm / yarn | npm >= 9.x hoặc yarn >= 1.22 |
| Git | >= 2.x |

---

## 📦 Clone Project

Để chạy được bản self-host, clone **đúng branch**:

```bash
git clone -b self-hosted/locket-dio https://github.com/doi2523/Client-Locket-Dio.git
cd Client-Locket-Dio
```

---

## 🗂 Cấu trúc thư mục

```
self-hosted/          
│    ├── api/          # API server (self-hosted)
│    │   ├── src/
│    │   ├── .env.example
│    │   └── package.json
│    │
│    ├── web/           # Giao diện người dùng (web client)
│         ├── public/
│         ├── src/
│         ├── .env.example
│         └── package.json
│
├── package.json        # Chứa lệnh thực thi nhanh
└── README.md
```

---

## 🐳 Vận hành bằng Docker

Project self-hosted dùng `docker-compose.yml` để chạy 3 service:

- `api` (port `5001`)
- `storage` (port `5003`)
- `web` (port `5173`)

### 1. Chuẩn bị môi trường

Yêu cầu:

- Docker Desktop (hoặc Docker Engine + Docker Compose)
- Đang đứng ở branch `self-hosted/locket-dio`

Di chuyển vào thư mục self-hosted:

```bash
cd apps/self-hosted
```

### 2. Tạo file `.env.production`

Hiện tại project có sẵn `.env.example` cho từng service. Tạo file production tương ứng:

```bash
# macOS / Linux
cp api/.env.example api/.env.production
cp storage/.env.example storage/.env.production
cp web/.env.example web/.env.production
```

```powershell
# Windows PowerShell
Copy-Item api/.env.example api/.env.production
Copy-Item storage/.env.example storage/.env.production
Copy-Item web/.env.example web/.env.production
```

Sau đó chỉnh các biến quan trọng trong từng file:

- `api/.env.production`: các biến Firebase/API
- `storage/.env.production`: R2 credentials, bucket, endpoint, `MEDIA_API_URL`
- `web/.env.production`: các biến `VITE_*` trỏ đúng domain/port backend

### 3. Build và chạy toàn bộ stack

```bash
docker compose up -d --build
```

Kiểm tra container đang chạy:

```bash
docker compose ps
```

Xem log realtime:

```bash
docker compose logs -f
```

Xem log riêng từng service:

```bash
docker compose logs -f api
docker compose logs -f storage
docker compose logs -f web
```

### 4. Truy cập sau khi chạy

- Web: `http://localhost:5173`
- API: `http://localhost:5001`
- Storage: `http://localhost:5003`

### 5. Các lệnh vận hành nhanh

Khởi động lại toàn bộ:

```bash
docker compose restart
```

Khởi động lại 1 service:

```bash
docker compose restart api
docker compose restart storage
docker compose restart web
```

Dừng stack (giữ volume/network):

```bash
docker compose down
```

Dừng và xóa image đã build của stack:

```bash
docker compose down --rmi local
```

Build lại từ đầu khi đổi Dockerfile/dependencies:

```bash
docker compose build --no-cache
docker compose up -d
```

### 6. Cập nhật code rồi chạy lại

```bash
git pull origin self-hosted/locket-dio
docker compose up -d --build
```

---

## 🚀 Cài đặt & Chạy

### 1. Backend (API)

```bash
cd api

# Cài đặt dependencies
npm install

# Sao chép file cấu hình môi trường
cp .env.example .env

# Chỉnh sửa file .env theo hướng dẫn bên dưới
nano .env   # hoặc dùng editor bạn thích

# Chạy server
npm run dev        # Chế độ phát triển (hot reload)
npm run start      # Chế độ production
```

Backend mặc định chạy tại: `http://localhost:5001`

---

### 2. Frontend (Web)

```bash
cd web

# Cài đặt dependencies
npm install

# Sao chép file cấu hình môi trường
cp .env.example .env

# Chỉnh sửa file .env, trỏ API_URL về backend của bạn
nano .env

# Chạy ứng dụng
npm run dev        # Chế độ phát triển
npm run build      # Build production
npm run preview    # Xem trước bản build
```

Frontend mặc định chạy tại: `http://localhost:5173`

---

## 🔧 Hướng dẫn Push Code

### Lần đầu tiên (thiết lập)

```bash
# Kiểm tra remote hiện tại
git remote -v

# Nếu chưa có remote, thêm vào
git remote add origin https://github.com/doi2523/Client-Locket-Dio.git
```

### Workflow thông thường

```bash
# 1. Đảm bảo bạn đang ở đúng branch
git checkout self-hosted/locket-dio

# 2. Kéo code mới nhất về (tránh conflict)
git pull origin self-hosted/locket-dio

# 3. Kiểm tra các file đã thay đổi
git status

# 4. Thêm file vào staging
git add .                        # Thêm tất cả
git add web/src/components/      # Hoặc thêm theo thư mục cụ thể

# 5. Commit với message rõ ràng
git commit -m "feat: mô tả ngắn thay đổi của bạn"

# 6. Push lên remote
git push origin self-hosted/locket-dio
```

### Ví dụ message commit chuẩn

```bash
git commit -m "feat: thêm tính năng đăng nhập Google"
git commit -m "fix: sửa lỗi hiển thị ảnh trên mobile"
git commit -m "chore: cập nhật dependencies"
git commit -m "docs: cập nhật README hướng dẫn cài đặt"
```

---

## 🌿 Quy tắc branch

| Branch | Mục đích |
|--------|----------|
| `main` | Bản gốc – **KHÔNG** commit thay đổi self-host vào đây |
| `self-hosted/locket-dio` | Bản self-host chính thức |
| `feature/tên-tính-năng` | Phát triển tính năng mới |
| `fix/tên-lỗi` | Sửa lỗi |

> ⚡ Nếu bạn muốn thêm tính năng mới, hãy tạo branch mới từ `self-hosted/locket-dio`:
>
> ```bash
> git checkout self-hosted/locket-dio
> git checkout -b feature/ten-tinh-nang-cua-ban
> ```

---

## 🐛 Góp ý & Báo lỗi

Nếu bạn gặp lỗi hoặc có ý tưởng cải thiện:

1. Mở [Issue](https://github.com/doi2523/Client-Locket-Dio/issues) mới trên GitHub
2. Mô tả rõ vấn đề, kèm screenshot nếu có
3. Hoặc tạo **Pull Request** trực tiếp vào branch `self-hosted/locket-dio`

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/doi2523">doi2523</a>
</div>