// src/utils/uuid.js
import { v4 as uuidv4 } from "uuid";

// Hàm tạo UUID v4 dạng uppercase
export function generateUUIDv4Upper() {
  return uuidv4().toUpperCase();
}
