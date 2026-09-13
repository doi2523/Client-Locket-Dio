# Apps Directory

Thư mục `apps/` chứa các ứng dụng chính của project.

## Structure

```
apps/
  main/           # Web client chính của dự án
  self-hosted/    # Bộ để tự host (self-host)
    web/          # Client đã chỉnh sửa để chạy với server riêng
    api/          # Backend API / uploader dùng cho self-host
```

## Mô tả

### `main`

Đây là **web client chính** của dự án.
Thư mục này chứa source code frontend được sử dụng mặc định.

### `self-hosted`

Thư mục này dành cho những ai muốn **tự host hệ thống**.

Nó bao gồm:

* **client** – phiên bản client đã cấu hình để kết nối tới server self-host.
* **api** – backend API xử lý upload, storage và các logic server cần thiết.

Người dùng muốn chạy self-host chỉ cần chạy phần `api` và sử dụng `client` trong thư mục này.
