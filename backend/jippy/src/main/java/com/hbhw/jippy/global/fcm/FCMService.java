package com.hbhw.jippy.global.fcm;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FCMService {

    /**
     * 그룹 채팅 멤버들에게 알림 전송 (데이터 payload만 전송)
     */
    public void sendGroupChatNotification(List<String> fcmTokens, String title, String body, Map<String, String> data) {
        for (String token : fcmTokens) {
            if (token != null && !token.isEmpty()) {
                // notification 필드 없이 데이터 payload에 title, body 포함
                Map<String, String> payloadData = new HashMap<>();
                if (data != null) {
                    payloadData.putAll(data);
                }
                payloadData.put("title", title);
                payloadData.put("body", body);

                Message message = Message.builder()
                        .setToken(token)
                        .putAllData(payloadData)
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
