package com.hbhw.jippy.domain.feedback.service;

import com.google.firebase.messaging.*;
import com.hbhw.jippy.domain.user.entity.UserOwner;
import com.hbhw.jippy.domain.user.repository.UserOwnerRepository;
import com.hbhw.jippy.domain.user.repository.UserStaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final UserOwnerRepository userOwnerRepository;


    /**
     * 웹(PWA) 브라우저용 FCM 알림 전송
     * @param storeId 매장 ID
     * @param content 피드백 내용
     */
    public void notifyOwner(int storeId, String content) {
        // 1) 사장님(Owner)의 FCM 토큰 조회 (DB나 다른 저장소에서 가져옴)
        String fcmToken = findOwnerWebToken(storeId);
        if (fcmToken == null || fcmToken.isEmpty()) {
            log.warn("[FCM] No web token found for storeId={}", storeId);
            return;
        }

        // 2) FCM 메시지 구성
        //    - WebpushConfig: 웹 브라우저(서비스워커)에서 받을 푸시 정보 설정
        Message message = Message.builder()
                .setToken(fcmToken)
                .setWebpushConfig(WebpushConfig.builder()
                        .putHeader("Urgency", "high")
                        .setNotification(new WebpushNotification(
                                "실시간 피드백 알림",
                                "새로운 LIVE 피드백: " + content,
                                "" // 아이콘 경로
                        ))
                        .build())
                .build();

        // 3) 전송
        try {
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("[FCM] 웹푸시 알림 전송 성공: {}", response);
        } catch (FirebaseMessagingException e) {
            log.error("[FCM] 웹푸시 알림 전송 실패: {}", e.getMessage(), e);
        }
    }


    private String findOwnerWebToken(int storeId) {
        // storeId로 사용자 검색
        UserOwner owner = userOwnerRepository.findUserOwnerByStoreId(storeId)
                .orElseThrow(() -> new RuntimeException("해당 매장 사장님을 찾을 수 없습니다."));

        // 저장해둔 FCM 토큰 반환
        return owner.getFcmToken();
    }


}
