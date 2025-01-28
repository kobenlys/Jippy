package com.hbhw.jippy.domain.feedback.service;

import com.hbhw.jippy.domain.feedback.dto.request.FeedbackRequest;
import com.hbhw.jippy.domain.feedback.dto.response.FeedbackResponse;
import com.hbhw.jippy.domain.feedback.entity.Feedback;
import com.hbhw.jippy.domain.feedback.repository.FeedbackRepository;
import com.hbhw.jippy.domain.feedback.enums.Category;
import com.hbhw.jippy.utils.DateTimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    /**
     * 고객 피드백 등록
     */
    public void createFeedback(int storeId, FeedbackRequest request) {
        Feedback feedback = Feedback.builder()
                .storeId(storeId)
                .category(request.getCategory())
                .content(request.getContent())
                .createdAt(DateTimeUtils.nowString())
                .build();

        feedbackRepository.save(feedback); // 저장만 수행, 반환 없음
    }


    /**
     * 매장 전체 피드백 조회
     */
    public List<FeedbackResponse> getFeedbacksByStore(int storeId) {
        List<Feedback> feedbackList = feedbackRepository.findByStoreId(storeId);
        return feedbackList.stream()
                .map(this::toResponse) // Entity에서 DTO로 변환
                .collect(Collectors.toList());
    }


    /**
     * 카테고리별 피드백 조회
     */
    public List<FeedbackResponse> getFeedbacksByCategory(int storeId, Category category) {
        List<Feedback> feedbackList = feedbackRepository.findByStoreIdAndCategory(storeId, category);
        return feedbackList.stream()
                .map(this::toResponse) // Entity에서 DTO로 변환
                .collect(Collectors.toList());
    }


    /**
     * 피드백 삭제 (점주 권한)
     */
    public void deleteFeedback(int storeId, Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("해당 피드백이 존재하지 않습니다."));

        // 다른 매장의 피드백을 지우지 못하도록 체크
        if (feedback.getStoreId() != storeId) {
            throw new RuntimeException("해당 매장의 피드백이 아닙니다.");
        }

        feedbackRepository.delete(feedback); // 삭제
    }

    private FeedbackResponse toResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .storeId(feedback.getStoreId())
                .category(feedback.getCategory())
                .content(feedback.getContent())
                .createdAt(feedback.getCreatedAt())
                .build();
    }

}
