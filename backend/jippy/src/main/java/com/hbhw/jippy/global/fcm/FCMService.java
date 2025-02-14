package com.hbhw.jippy.global.fcm;

// FCMService.java
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FCMService {

    /**
     * 그룹 채팅 멤버들에게 알림 전송
     */
    public void sendGroupChatNotification(List<String> fcmTokens, String title, String body) {
        for (String token : fcmTokens) {
            if (token != null && !token.isEmpty()) {
                Notification notification = Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build();

                Message message = Message.builder()
                        .setToken(token)
                        .setNotification(notification)
                        .build();

                try {
                    String response = FirebaseMessaging.getInstance().send(message);
                    System.out.println("FCM 메시지 전송 성공: " + response);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

