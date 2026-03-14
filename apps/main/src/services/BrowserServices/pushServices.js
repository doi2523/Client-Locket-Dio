import axios from "axios";
import { CONFIG } from "@/config";
import { API_URL, urlBase64ToUint8Array } from "@/utils";

/**
 * Lấy Push Subscription hiện tại (nếu có)
 * @returns {Object|null} subscription JSON hoặc null nếu chưa đăng ký
 */
export const getPushSubscription = async () => {
  // Trình duyệt không hỗ trợ service worker
  if (!("serviceWorker" in navigator)) return null;

  // Đợi service worker sẵn sàng
  const registration = await navigator.serviceWorker.ready;

  // Lấy subscription hiện tại
  const sub = await registration.pushManager.getSubscription();

  // Nếu có -> trả JSON, không -> null
  return sub ? sub.toJSON() : null;
};

/**
 * Kiểm tra xem đã đăng ký push chưa
 * @returns {boolean} true nếu đã đăng ký
 */
export const checkPushSubscription = async () => {
  // Không hỗ trợ service worker
  if (!("serviceWorker" in navigator)) return false;

  // Lấy service worker registration
  const registration = await navigator.serviceWorker.ready;

  // Kiểm tra subscription
  const sub = await registration.pushManager.getSubscription();

  // Convert sang boolean
  return !!sub;
};

/**
 * Đăng ký Push Notification cho user
 * - Xin quyền Notification
 * - Tạo Push Subscription
 * - Gửi subscription lên server
 *
 * @returns {Object|null} subscription JSON hoặc null nếu thất bại
 */
export const subscribePush = async () => {
  // Trình duyệt không hỗ trợ Notification
  if (!("Notification" in window)) return null;

  // Trình duyệt không hỗ trợ Service Worker
  if (!("serviceWorker" in navigator)) return null;

  // Xin quyền gửi notification
  const permissionResult = await Notification.requestPermission();

  // Nếu user từ chối
  if (permissionResult !== "granted") return null;

  // Đợi service worker sẵn sàng
  const registration = await navigator.serviceWorker.ready;

  // Kiểm tra subscription hiện tại
  let subscription = await registration.pushManager.getSubscription();

  // Nếu chưa có thì tạo mới
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // VAPID public key dùng để xác thực push
      applicationServerKey: urlBase64ToUint8Array(CONFIG.keys.vapidPublicKey),
    });
  }

  // Gửi subscription lên server để lưu
  await axios.post(API_URL.REGISTER_PUSH_URL, {
    subscription,
  });

  // Trả subscription dạng JSON
  return subscription.toJSON();
};