// src/utils/uuid.js
import { v4 as uuidv4 } from "uuid";

// Hàm tạo UUID v4 dạng uppercase
export function generateUUIDv4Upper() {
  return uuidv4().toUpperCase();
}

export function getDeviceId() {
  const KEY = "locket_device_id";

  let deviceId = localStorage.getItem(KEY);

  if (!deviceId) {
    deviceId = generateUUIDv4Upper();
    localStorage.setItem(KEY, deviceId);
  }

  return deviceId;
}
