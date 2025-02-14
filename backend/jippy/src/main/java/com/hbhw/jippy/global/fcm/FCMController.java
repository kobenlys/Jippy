package com.hbhw.jippy.global.fcm;

import com.hbhw.jippy.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fcm")
@RequiredArgsConstructor
public class FCMController {

    private final FCMTokenService fcmTokenService;

    /**
     * 클라이언트에서 전송한 FCM 토큰을 저장 또는 업데이트합니다.
     * 예시 요청 바디: { "userId": 1, "token": "abc123...", "userType": "owner" }
     */
    @PostMapping("/token")
    public ApiResponse<?> updateFcmToken(@RequestBody FCMTokenRequest request) {
        fcmTokenService.updateToken(request);
        return ApiResponse.success("FCM 토큰이 업데이트되었습니다.");
    }
}
