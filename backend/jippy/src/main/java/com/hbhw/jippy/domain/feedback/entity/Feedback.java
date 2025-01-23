package com.hbhw.jippy.domain.feedback.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer storeId;
    @Convert(converter = Category.class)
    private Category category;
    private String content;
    private String createdAt;
}