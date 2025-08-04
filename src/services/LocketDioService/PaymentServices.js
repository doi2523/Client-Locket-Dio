import axios from "axios";
import { PAYMENT_API_URL } from "../../utils";
import api from "../../lib/axios";

export const CreateNewOrder = async (planId, price, coupon) => {
  try {
    const res = await api.post(`${PAYMENT_API_URL}/api/orders`, {
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
    const res = await axios.post(`${PAYMENT_API_URL}/api/od`, {
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
      `${PAYMENT_API_URL}/api/orders/cancel`,
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
