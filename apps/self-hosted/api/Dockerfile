# Locket Dio Self-hosted API
FROM node:20-slim

# Tạo thư mục làm việc trong container
WORKDIR /app

# Cài đặt dependencies (chỉ production)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy toàn bộ source code vào container
COPY . .

# Biến môi trường mặc định, có thể override từ docker-compose
ENV NODE_ENV=production

# API lắng nghe trên cổng 5001 (theo .env.example)
EXPOSE 5001

# Chạy ứng dụng Express
CMD ["node", "app.js"]
