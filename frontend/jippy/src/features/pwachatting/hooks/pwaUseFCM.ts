import { useEffect, useCallback } from "react";
import { getMessaging, getToken, MessagePayload } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAeyyqdIG8ALszCkNP3uW4Gprhbje4A",
  authDomain: "jippy-23ce2.firebaseapp.com",
  projectId: "jippy-23ce2",
  storageBucket: "jippy-23ce2.firebasestorage.app",
  messagingSenderId: "70892831219",
  appId: "1:70892831219:web:71e8d19f9d4b52ee9f5286",
  measurementId: "G-891SKEBEDW"
};

let isInitialized = false;

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const usePwaFCM = () => {
  const userId = getCookieValue('userId');
  const userType = getCookieValue('staffType');

  const saveTokenToBackend = useCallback(async (token: string) => {
    try {
      if (!userId || !userType) {
        console.log('사용자 정보 없음:', { userId, userType });
        throw new Error("사용자 정보가 없습니다.");
      }
      console.log('토큰 저장 시도:', { userId, userType, token });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fcm/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          token,
          userType
        }),
      });

      const responseData = await response.text();
      console.log('서버 응답:', {
        status: response.status,
        data: responseData
      });
    } catch (error) {
      console.error("토큰 저장 중 에러:", error);
      throw error;
    }
  }, [userId, userType]);

  useEffect(() => {
    let messaging: import('firebase/messaging').Messaging;

    const initializeFCM = async () => {
      if (isInitialized) {
        console.log('FCM already initialized');
        return;
      }

      try {
        if (!userId || !userType) return;

        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
          console.log('Push 알림이 지원되지 않는 브라우저입니다.');
          return;
        }

        const app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: swRegistration
          });

          if (token) {
            await saveTokenToBackend(token);
          }
        }

        const { onMessage } = await import('firebase/messaging');
        onMessage(messaging, (payload: MessagePayload) => {
          if ('Notification' in window && Notification.permission === 'granted') {
            const title = payload.data?.title || 'JIPPY Alert';
            const body = payload.data?.body || '새로운 메시지가 도착했습니다.';
            
            new Notification(title, { body });
          }
        });

        isInitialized = true;
        console.log('FCM initialized successfully');

      } catch (error) {
        console.error('FCM 초기화 중 에러 발생:', error);
      }
    };

    initializeFCM();

    return () => {};
  }, [userId, userType, saveTokenToBackend]);
};