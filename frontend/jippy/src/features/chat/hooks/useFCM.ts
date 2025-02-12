// src/features/chat/hooks/useFCM.ts
import { useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const useFCM = () => {
  const initializeFCM = useCallback(async () => {
    try {
      const app = initializeApp(firebaseConfig);
      const messaging: Messaging = getMessaging(app);
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, { vapidKey });
      console.log("FCM 토큰:", token);
      // 필요 시, 토큰을 백엔드에 저장하여 특정 사용자에게 알림 전송 가능

      onMessage(messaging, (payload) => {
        console.log("FCM 메시지 수신:", payload);
        // 예: toast 메시지 혹은 알림 UI 업데이트
      });
    } catch (error) {
      console.error("FCM 초기화 에러:", error);
    }
  }, []);

  return { initializeFCM };
};

export default useFCM;


