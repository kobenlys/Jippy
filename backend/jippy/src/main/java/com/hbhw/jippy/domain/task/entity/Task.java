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

    /**
     * @ManyToOne(fetch = FetchType.LAZY)
     * @JoinColumn(name = "store_id", nullable = false)
     * private Store store;
     */
    /** 매장 ID */
    @Column(name = "store_id", nullable = false)
    private Integer storeId;

    /** 할 일 제목 */
    @Column(name = "title", nullable = false, length = 50)
    private String title;

    /** 할 일 내용 */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * 작성 시각 (DB에서 VARCHAR(20)로 관리)
     * ex) "2025-01-01 10:30:00"
     */
    @Column(name = "created_at", nullable = false, length = 20)
    private String createdAt;

    /** 완료 여부 */
    @Column(name = "is_complete", nullable = false)
    private Boolean isComplete;

}
