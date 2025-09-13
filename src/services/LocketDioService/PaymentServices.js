import axios from "axios";
import api from "@/lib/axios";
import { CONFIG } from "@/config";

export const CreateNewOrder = async (planId, price, coupon) => {
  try {
    const res = await api.post(`${CONFIG.api.payment}/api/orders`, {
      planId,
      price,
      coupon,
    });
    const orderData = res?.data?.data;
    return orderData;
  } catch (err) {
    console.warn("❌ React Failed", err);
  }
};

export const GetInfoOrder = async (orderId) => {
  try {
    const res = await axios.post(`${CONFIG.api.payment}/api/od`, {
      id: orderId,
    });
    const orderData = res?.data?.data;
    return orderData;
  } catch (err) {
    console.warn("❌ React Failed", err);
  }
};

export const CancelToOrder = async (orderId, orderCode) => {
  try {
    const res = await axios.post(
      `${CONFIG.api.payment}/api/orders/cancel`,
      {
        orderId,
        orderCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const orderData = res?.data?.data;
    return orderData;
  } catch (err) {
    console.warn("❌ React Failed", err);
  }
};
