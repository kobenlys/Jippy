// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.3.0/firebase-messaging-compat.js');

// 서비스 워커에서는 환경변수를 직접 불러올 수 없으므로, 아래에 직접 설정한 값을 넣어주세요.
// (빌드 시 자동 치환하는 스크립트를 사용하거나, 수동으로 입력)
firebase.initializeApp({
    apiKey: "AIzaSyAeyyqdIG8ALszCkNP3PG1uW4Gprhbje4A",
  authDomain: "jippy-23ce2.firebaseapp.com",
  projectId: "jippy-23ce2",
  storageBucket: "jippy-23ce2.firebasestorage.app",
  messagingSenderId: "70892831219",
  appId: "1:70892831219:web:71e8d19f9d4b52ee9f5286",
  measurementId: "G-891SKEBEDW"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const { title, body, image } = payload.notification;
  const notificationOptions = {
    body,
    icon: image || '/icons/pwa.png', // 기본 아이콘 경로
  };

  self.registration.showNotification(title, notificationOptions);
});
