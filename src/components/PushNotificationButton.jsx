// src/components/PushNotificationButton.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils';

const PushNotificationButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setPermissionGranted(true);
        }
      });
    }
  }, []);

  const subscribeToPush = async () => {
    try {
      const swRegistration = await navigator.serviceWorker.register('/service-worker.js');
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY, // VAPID public key
      });

      // Gửi Subscription đến backend để lưu vào Supabase
      const { data } = await axios.post(API_URL.SUBCRIBE, {
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys,
      });

      if (data.success) {
        setIsSubscribed(true);
        console.log('Subscription saved to database');
      } else {
        console.error('Error saving subscription');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  return (
    <div className=''>
      {permissionGranted && !isSubscribed && (
        <button onClick={subscribeToPush}>Đăng ký nhận thông báo</button>
      )}
      {isSubscribed && <p>Đã đăng ký nhận thông báo!</p>}
    </div>
  );
};

export default PushNotificationButton;
