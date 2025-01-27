package com.hbhw.jippy.domain.task.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest {
    private Integer userStaffId;  // 작성자(직원) 식별자
    private String title;         // 할 일 제목
    private String content;       // 할 일 내용
    private String author;        // 작성자명
    private boolean isComplete;   // 완료 여부
}
