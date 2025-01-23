package com.hbhw.jippy.domain.feedback.dto.request;

import com.hbhw.jippy.domain.feedback.entity.Category;
import lombok.Getter;
import lombok.Setter;

/**
 * 피드백 작성 시 클라이언트가 보내는 데이터
 */
@Getter
@Setter
public class FeedbackRequest {

    private Integer storeId;    // 매장 아이디
    private Category category;  // 카테고리(enum)
    private String content;     // 피드백 내용
}