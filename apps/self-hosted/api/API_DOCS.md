# 📡 Self-Hosted API Locket Dio — API Reference

<p>Tài liệu mô tả toàn bộ các endpoint của Locket Dio Self-Hosted API.</p>

[![Về README](https://img.shields.io/badge/←_Về_README-blue?style=flat-square)](./README.md)

</div>

---

## 📌 Thông Tin Chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Base URL (dev) | `http://localhost:5001/locket` |
| Base URL (prod) | `http://localhost:5001/locket` |
| Định dạng dữ liệu | `application/json` |
| Xác thực | Bearer Token (JWT) |

---

## 🔑 Xác Thực (Authentication)

Hầu hết các endpoint yêu cầu token JWT trong header:

```http
Authorization: Bearer <your_token>
```

Token được trả về sau khi đăng nhập thành công qua `POST /locket/login`.

---

## 📂 Endpoints

### 🟢 Auth

#### `POST /locket/login` — Đăng nhập

**Request Body:**
```json
{
  "email": "dio@example.com",
  "password": "matkhau123"
}
```

**Response `200`:**
```json
{
    "data": {
        "kind": "identitytoolkit#VerifyPasswordResponse",
        "localId": "your_user_id_locket",
        "email": "dio@example.com",
        "displayName": "your_display_name",
        "idToken": "your_token",
        "expiresIn": "3600"
    },
    "success": true,
    "message": "ok"
}
```

---

#### `POST /locket/refresh-token` — Làm mới token

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token",
}
```

**Response `200`:**
```json
{
    "data": {
        "access_token": "your_token",
        "expires_in": "3600",
        "token_type": "Bearer",
        "refresh_token": "your_data",
        "id_token": "your_data",
        "user_id": "your_data",
        "project_id": "your-firebase-project-id"
    },
    "success": true,
    "message": "ok"
}
```

---

#### `POST /locket/logout` — Đăng xuất

> 🔒 Yêu cầu xác thực

**Response `200`:**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

### 🖼️ PostMoment

#### `POST /locket/postMomentV1` — Upload ảnh/video

> 🔒 Yêu cầu xác thực

**Content-Type:** `multipart/form-data`

| Field | Kiểu | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `file` | File | ✅ | Ảnh/Video cần upload (jpg, png, webp, mp4,...) |
| `optionsData` | String | ✅ | Chú thích ảnh/video |

```http
POST /locket/postMomentV1
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "model": "Version-UploadmediaV0.1",
  "file": <data>,
  "optionsData": {
    "caption": "Caption tuỳ chọn",
    "overlay_id": "abc123",
    "type": "caption_theme",
    "icon": "❤️",
    "text_color": "#FFFFFF",
    "color_top": "#000000",
    "color_bottom": "#FF0000",
    "audience": "selected",
    "recipients": ["uid1", "uid2"],
  }
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Upload media successfully",
  "data": {}
}
```

---

#### `POST /locket/postMomentV2` — Upload ảnh/video

> 🔒 Yêu cầu xác thực

```http
POST /locket/postMomentV2
Authorization: Bearer {token}
Content-Type: application/json

{
  "model": "Version-UploadmediaV3.1",
  "mediaInfo": {
    "url": "https://cdn.example.com/path/to/file.jpg",
    "path": "user_uploads/abc123.jpg",
    "name": "abc123.jpg",
    "size": 194203,
    "contentType": "image/jpeg",
    "timeCreated": "2025-07-24T14:30:00Z",
    "type": "image"
  },
  "options": {
    "caption": "Caption tuỳ chọn",
    "overlay_id": "abc123",
    "type": "caption_theme",
    "icon": "❤️",
    "text_color": "#FFFFFF",
    "color_top": "#000000",
    "color_bottom": "#FF0000",
    "audience": "selected",
    "recipients": ["uid1", "uid2"],
    "music": "https://cdn.example.com/music.mp3"
  }
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Upload media successfully",
  "data": {}
}
```

---

### 👤 Users — Người Dùng

#### `GET /locket/getInfoUser` — Lấy thông tin cá nhân

> 🔒 Yêu cầu xác thực

**Response `200`:**
```json
{
    "success": true,
    "message": "ok",
    "data": {
        "uid": "your_data",
        "localId": "your_data",
        "customAuth": true,
        "phoneNumber": "your_data",
        "displayName": "your_data",
        "email": "dio@example.com",
        "lastLoginAt": "1773592546587",
        "lastRefreshAt": "2026-03-15T16:35:46.587Z",
        "emailVerified": null or true or false,
        "username": "your_data",
        "firstName": "your_data",
        "lastName": "your_data",
        "profilePicture": "your_data",
        "inviteToken": "your_data",
        "migratedAt": "2025-07-18T09:03:36.550Z",
        "createdAt": "2025-07-18T09:03:36.550Z",
        "lastFriendsChange": "2026-03-05T15:15:10.136Z",
        "birthday": null or your_data
    }
}
```

---

## ❌ Mã Lỗi (Error Codes)

| HTTP Status | Code | Ý nghĩa |
|-------------|------|---------|
| `400` | `BAD_REQUEST` | Dữ liệu đầu vào không hợp lệ |
| `401` | `UNAUTHORIZED` | Chưa xác thực hoặc token hết hạn |
| `403` | `FORBIDDEN` | Không có quyền truy cập |
| `404` | `NOT_FOUND` | Tài nguyên không tồn tại |
| `409` | `CONFLICT` | Dữ liệu đã tồn tại (email trùng...) |
| `429` | `TOO_MANY_REQUESTS` | Vượt giới hạn request |
| `500` | `INTERNAL_ERROR` | Lỗi máy chủ nội bộ |

**Cấu trúc lỗi chuẩn:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token không hợp lệ hoặc đã hết hạn"
  }
}
```

---

## 📝 Ghi Chú

- Tất cả timestamp đều theo định dạng **ISO 8601** (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- Kích thước file upload tối đa: **5MB**
- Định dạng ảnh được chấp nhận: `jpg`, `jpeg`, `png`, `webp`, `mp4`, `...`

---

<div align="center">

**[← Về README](./README.md) | © 2025 [Locket Dio](https://locket-dio.com)**

</div>