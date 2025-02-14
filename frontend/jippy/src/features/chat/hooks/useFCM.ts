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

const useFCM = (userId: number, userType: string) => {
  // 백엔드에 FCM 토큰 저장
  const saveTokenToBackend = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fcm/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 원래처럼 userId, token, userType을 함께 전송
        body: JSON.stringify({ userId, token, userType }),
      });
      if (!response.ok) {
        throw new Error("토큰 저장 실패");
      }
      console.log("FCM 토큰이 백엔드에 저장되었습니다.");
    } catch (error) {
      console.error("토큰 저장 중 에러:", error);
    }
  }, [userId, userType]);

  const initializeFCM = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("FCM 알림 권한이 거부되었습니다.");
        return;
      }

      const app = initializeApp(firebaseConfig);
      const messaging: Messaging = getMessaging(app);
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, { vapidKey });
      console.log("FCM 토큰:", token);
      if (token) {
        await saveTokenToBackend(token);
      }

      onMessage(messaging, (payload) => {
        console.log("FCM 메시지 수신:", payload);
        // 필요 시, 알림 UI 업데이트 처리
      });
    } catch (error) {
      console.error("FCM 초기화 에러:", error);
    }
  }, [saveTokenToBackend]);

  return { initializeFCM };
};

export default useFCM;
