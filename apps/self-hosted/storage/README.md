# 📦 R2 Storage — LocketDio

> Backend Node.js/Express tạo **Presigned URL** để upload file lên Cloudflare R2.

---

## 📋 Mục lục

- [1. Cài đặt & Chạy dự án](#1-cài-đặt--chạy-dự-án)
- [2. API — `POST /api/presignedV3`](#2-api--post-apipresignedv3)
  - [2.1 Request](#21-request)
  - [2.2 Cấu trúc key lưu trên R2](#22-cấu-trúc-key-lưu-trên-r2)
  - [2.3 Response thành công](#23-response-thành-công)
  - [2.4 Response lỗi](#24-response-lỗi)
- [3. API — `POST /api/delete`](#3-api--post-apidelete)
  - [3.1 Request](#31-request)
  - [3.2 Response](#32-response)
- [4. Flow upload hoàn chỉnh](#4-flow-upload-hoàn-chỉnh)
- [5. Gợi ý lưu metadata](#5-gợi-ý-lưu-metadata)

---

## 1. Cài đặt & Chạy dự án

### Yêu cầu

- Node.js LTS (khuyên dùng v18+)
- npm

### Bước 1 — Cài dependency

```bash
cd apps/self-hosted/storage
npm install
```

### Bước 2 — Tạo file `.env`

```bash
cp .env.example .env
```

| Biến              | Mô tả                                          |
|-------------------|------------------------------------------------|
| `PORT`            | Port server (mặc định: `5003`)                 |
| `R2_ENDPOINT`     | Endpoint Cloudflare R2                         |
| `R2_ACCESS_KEY`   | Access key R2                                  |
| `R2_SECRET_KEY`   | Secret key R2                                  |
| `R2_BUCKET`       | Tên bucket R2                                  |
| `MEDIA_API_URL`   | Base URL public để tạo `publicURL`             |

### Bước 3 — Chạy server

```bash
npm start
```

Server chạy tại: `http://localhost:5003`

---

## 2. API — `POST /api/presignedV3`

Tạo presigned URL để client upload file trực tiếp lên R2.

- **Auth**: ✅ Yêu cầu `verifyIdToken` — request phải kèm ID Token hợp lệ để đọc `req.user.uid`.

### 2.1 Request

**Headers**

```http
POST /api/presignedV3
Content-Type: application/json
Authorization: Bearer <id_token>
```

**Body**

```json
{
  "filename": "locketdio_1710500000000_abc123_cli1.0.0.jpg",
  "contentType": "image/jpeg",
  "type": "image",
  "size": 123456,
  "uploadedAt": "2024-03-15T10:20:30.000Z"
}
```

| Field         | Bắt buộc | Mô tả                                                              |
|---------------|----------|--------------------------------------------------------------------|
| `filename`    | ✅        | Tên file lưu trên R2 (format: `locketdio_<ts>_<id>_cli<ver>.<ext>`) |
| `contentType` | ✅        | MIME type thực của file                                            |
| `type`        | ✅        | `image` hoặc `video` (BE tự suy lại từ `contentType`)             |
| `size`        | ❌        | Kích thước file (chưa dùng trong logic)                            |
| `uploadedAt`  | ❌        | Thời gian upload (chưa dùng trong logic)                           |

**MIME type được phép (`ALLOWED_MIME_TYPES`)**

| Loại     | MIME types                                                                        |
|----------|-----------------------------------------------------------------------------------|
| 🖼 Ảnh   | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/heic`, `image/heif` |
| 🎬 Video | `video/mp4`, `video/webm`, `video/quicktime`                                      |

---

### 2.2 Cấu trúc key lưu trên R2

```
LocketCloud/{todayFolder}/{safeType}/{uid}/{safeFilename}
```

| Phần           | Giá trị                                                                  |
|----------------|--------------------------------------------------------------------------|
| `todayFolder`  | Ngày upload, ví dụ: `2024/03/15`                                         |
| `safeType`     | `video` nếu `contentType` bắt đầu bằng `video/`, còn lại là `image`     |
| `uid`          | User ID từ `req.user.uid` (sau khi xác thực token)                       |
| `safeFilename` | `filename` đã lọc, chỉ giữ ký tự `[a-zA-Z0-9._-]`                       |

**Ví dụ key thực tế:**

```
LocketCloud/2024/03/15/image/user_uid_abc123/locketdio_1710500000000_abc123_cli1.0.0.jpg
```

---

### 2.3 Response thành công

**`200 OK`**

```json
{
  "status": "success",
  "data": {
    "url": "https://r2-presigned-url...",
    "expiresIn": 300,
    "key": "LocketCloud/2024/03/15/image/<uid>/locketdio_....jpg",
    "publicURL": "https://your-media-domain.com/LocketCloud/2024/03/15/image/<uid>/locketdio_....jpg"
  },
  "message": "Presigned URL generated successfully",
  "meta": {
    "note": "Use this URL only once — it will expire in 5 minutes!",
    "uk": "null because this is not a user-specific action",
    "me": "u not admin",
    "u": "<uid>"
  }
}
```

| Field       | Mô tả                                              |
|-------------|----------------------------------------------------|
| `url`       | Presigned URL (method `PUT`) để upload file lên R2 |
| `expiresIn` | Thời gian sống của URL — **300 giây (5 phút)**     |
| `key`       | Đường dẫn file trong bucket R2                     |
| `publicURL` | URL công khai để client dùng xem / tải file        |

---

### 2.4 Response lỗi

#### Thiếu field bắt buộc — `400 Bad Request`

```json
{
  "status": "error",
  "message": "Request body must include 'filename' and 'type'",
  "errorCode": "MISSING_BODY_FIELDS"
}
```

#### MIME type không hợp lệ — `400 Bad Request`

```json
{
  "status": "error",
  "message": "File type not allowed",
  "errorCode": "INVALID_FILE_TYPE",
  "allowed": [
    "image/jpeg", "image/png", "image/webp",
    "image/gif", "image/heic", "image/heif",
    "video/mp4", "video/webm", "video/quicktime"
  ]
}
```

#### Lỗi server nội bộ — `500 Internal Server Error`

```json
{
  "status": "error",
  "message": "Failed to generate presigned URL",
  "errorCode": "INTERNAL_ERROR"
}
```

---

## 3. API — `POST /api/delete`

Xoá file khỏi bucket R2 theo `key`.

- **Auth**: ❌ Không yêu cầu `verifyIdToken` (có thể thêm tuỳ môi trường).

### 3.1 Request

**Headers**

```http
POST /api/delete
Content-Type: application/json
```

**Body**

```json
{
  "key": "LocketCloud/2024/03/15/image/<uid>/locketdio_....jpg"
}
```

> `key` là giá trị nhận về từ `/api/presignedV3`.

Nếu **thiếu `key`**:

```json
{
  "error": "Missing key"
}
```

---

### 3.2 Response

#### Xoá thành công — `200 OK`

```json
{
  "success": true,
  "message": "File deleted"
}
```

#### Lỗi server — `500 Internal Server Error`

```json
{
  "error": "Failed to delete file"
}
```

---

## 4. Flow upload hoàn chỉnh

```
Client ──(1)──► POST /api/presignedV3 ──► Server ──► Cloudflare R2
                                               │
                                         trả về url,
                                         publicURL, key
                                               │
Client ◄──(2)─────────────────────────────────┘
   │
   └──(3)──► PUT <presigned_url>
                  Header: Content-Type: <contentType>
                  Body:   <binary file>
   │
   └──(4)──► Lưu publicURL + metadata vào DB / state
```

**① Gọi BE lấy presigned URL**

```bash
curl -X POST https://your-api.com/api/presignedV3 \
  -H "Authorization: Bearer <id_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "locketdio_1710500000000_abc123_cli1.0.0.jpg",
    "contentType": "image/jpeg",
    "type": "image",
    "size": 123456,
    "uploadedAt": "2024-03-15T10:20:30.000Z"
  }'
```

**② Nhận về `url`, `publicURL`, `key` từ response**

**③ Upload file trực tiếp lên R2 bằng HTTP PUT**

```bash
curl -X PUT "<url_tra_ve>" \
  -H "Content-Type: image/jpeg" \
  --data-binary "@/path/to/file.jpg"
```

**④ Lưu metadata vào DB / state của app**

---

## 5. Gợi ý lưu metadata

Khi lưu thông tin một file vào DB, nên lưu đầy đủ các field sau:

| Field         | Nguồn                   | Mục đích                            |
|---------------|-------------------------|-------------------------------------|
| `downloadURL` | `publicURL` từ response | Hiển thị / tải file                 |
| `path`        | `key` từ response       | Dùng để xoá file qua `/api/delete`  |
| `name`        | `filename` gốc          | Tên hiển thị                        |
| `size`        | Client                  | Thông tin kích thước                |
| `type`        | `contentType`           | Phân loại ảnh / video               |
| `uploadedAt`  | Client                  | Thời gian upload                    |

---