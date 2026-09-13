# ==============================
#  Stage 1: Build frontend
# ==============================
FROM node:20-slim AS builder

WORKDIR /app

# Cài đặt dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build ở chế độ production
# Lưu ý: các biến VITE_* sẽ được đọc từ .env.production nếu file này tồn tại trong context
ENV NODE_ENV=production
RUN npm run build

# ==============================
#  Stage 2: Serve build (Vite preview)
# ==============================
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy package info + node_modules để dùng script npm preview
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy thư mục build
COPY --from=builder /app/dist ./dist

# (Tùy chọn) copy thêm vite.config nếu Vite cần khi preview
COPY --from=builder /app/vite.config.js ./vite.config.js

EXPOSE 5173

# Chạy Vite preview, listen 0.0.0.0 để truy cập từ ngoài
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
