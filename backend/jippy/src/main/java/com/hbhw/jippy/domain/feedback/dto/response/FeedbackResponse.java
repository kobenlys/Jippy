package com.hbhw.jippy.domain.feedback.dto.response;

import com.hbhw.jippy.domain.feedback.enums.Category;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FeedbackResponse {

    private Long id;
    private int storeId;
    private Category category;
    private String content;
    private String createdAt;
}
