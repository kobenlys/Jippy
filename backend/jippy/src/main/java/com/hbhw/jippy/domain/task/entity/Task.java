package com.hbhw.jippy.domain.task.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "store_todo_list")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    /** PK */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 매장 ID */
    @Column(name = "store_id", nullable = false)
    private Integer storeId;

    /** 직원(스태프) ID */
    @Column(name = "user_staff_id", nullable = false)
    private Integer userStaffId;

    /** 할 일 제목 */
    @Column(name = "title", length = 50, nullable = false)
    private String title;

    /** 할 일 내용 */
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    /**
     * 작성 시각 (DB에서 VARCHAR(20)로 관리)
     * ex) "2025-01-01 10:30:00"
     */
    @Column(name = "created_at", length = 20, nullable = false)
    private String createdAt;

    /** 작성자 */
    @Column(name = "author", length = 50)
    private String author;

    /** 완료 여부 */
    @Column(name = "is_complete", nullable = false)
    private boolean isComplete;

}
