package com.hbhw.jippy.domain.feedback.controller;

import com.hbhw.jippy.domain.feedback.dto.request.FeedbackRequest;
import com.hbhw.jippy.domain.feedback.dto.response.FeedbackResponse;
import com.hbhw.jippy.domain.feedback.enums.Category;
import com.hbhw.jippy.domain.feedback.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * 권한 : 고객
     * 고객 피드백 등록
     * POST /api/feedback/{storeId}/create
     */
    @PostMapping("/{storeId}/create")
    //@PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<FeedbackResponse> createFeedback(@PathVariable int storeId,
                                                           @RequestBody FeedbackRequest request) {
        FeedbackResponse response = feedbackService.createFeedback(storeId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 권한 : 점주
     * 매장 고객 피드백 조회
     * GET /api/feedback/{storeId}/select
     */
    @GetMapping("/{storeId}/select")
    //@PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<FeedbackResponse>> getFeedbacks(@PathVariable int storeId) {
        List<FeedbackResponse> responseList = feedbackService.getFeedbacksByStore(storeId);
        return ResponseEntity.ok(responseList);
    }

    /**
     * 권한 : 점주
     * 카테고리별 피드백 조회
     * GET /api/feedback/{storeId}/select/{category}
     */
    @GetMapping("/{storeId}/select/{category}")
    //@PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<FeedbackResponse>> getFeedbacksByCategory(
            @PathVariable int storeId,
            @PathVariable Category category
    ) {
        List<FeedbackResponse> responseList = feedbackService.getFeedbacksByCategory(storeId, category);
        return ResponseEntity.ok(responseList);
    }

    /**
     * 권한 : 점주
     * 고객 피드백 삭제
     * DELETE /api/feedback/{storeId}/delete/{feedbackId}
     */
    @DeleteMapping("/{storeId}/delete/{feedbackId}")
    //@PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable int storeId,
                                               @PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(storeId, feedbackId);
        return ResponseEntity.ok().build();
    }
}
