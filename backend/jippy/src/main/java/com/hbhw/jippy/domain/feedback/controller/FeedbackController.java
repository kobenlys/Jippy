package com.hbhw.jippy.domain.feedback.controller;

import com.hbhw.jippy.domain.feedback.dto.request.FeedbackRequest;
import com.hbhw.jippy.domain.feedback.dto.response.FeedbackResponse;
import com.hbhw.jippy.domain.feedback.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 고객이 QR 코드를 통해 접속하여 텍스트 형태의 피드백을 작성/조회/삭제하는 Controller
 */
@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * 1. 피드백 수집 API (POST /api/feedback)
     *    - RequestBody로 텍스트 데이터를 받아 DB에 저장
     */
    @PostMapping
    // @PreAuthorize("hasRole('USER')") // 특정 권한이 필요한 경우(예: USER 권한)
    public ResponseEntity<FeedbackResponse> createFeedback(@RequestBody FeedbackRequest request) {
        FeedbackResponse response = feedbackService.createFeedback(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 2. 피드백 조회 API (GET /api/feedback)
     *    - 모든 피드백 목록을 조회한다고 가정
     *    - 단일 조회가 필요하다면 /api/feedback/{id} 형태의 추가 메서드 작성 가능
     */
    @GetMapping
    // @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        List<FeedbackResponse> feedbackList = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbackList);
    }

    /**
     * 3. 피드백 삭제 API (DELETE /api/feedback/{id})
     *    - path variable로 전달된 id에 해당하는 피드백을 삭제
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // 관리자 권한이 필요한 경우 예시
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}