package com.hbhw.jippy.domain.feedback.service;

import com.hbhw.jippy.domain.feedback.dto.request.FeedbackRequest;
import com.hbhw.jippy.domain.feedback.dto.response.FeedbackResponse;
import com.hbhw.jippy.domain.feedback.entity.Category;
import com.hbhw.jippy.domain.feedback.entity.Feedback;
import com.hbhw.jippy.domain.feedback.repository.FeedbackRepository;
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

    public FeedbackResponse createFeedback(FeedbackRequest request) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        Feedback feedback = Feedback.builder()
                .storeId(request.getStoreId())
                .category(request.getCategory() != null ? request.getCategory() : Category.ETC)
                .content(request.getContent())
                .createdAt(now)
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        return toResponse(saved);
    }

    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
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