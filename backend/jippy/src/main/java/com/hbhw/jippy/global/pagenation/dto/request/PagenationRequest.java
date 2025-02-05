package com.hbhw.jippy.global.pagenation.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "페이지네이션 요청 DTO")
public class PagenationRequest {

    @Schema(description = "페이지 번호 (0부터 시작)", example = "0")
    @Builder.Default
    private Integer page = 0;

    @Schema(description = "페이지 크기", example = "10")
    @JsonProperty("page_size")
    @Builder.Default
    private Integer pageSize = 10;

    @Schema(description = "정렬 기준", example = "createdAt")
    @JsonProperty("sort_by")
    @Builder.Default
    private String sortBy = "createdAt";

    @Schema(description = "정렬 방향 (ASC, DESC", example = "DESC")
    @Builder.Default
    private String direction = "DESC";

    public Pageable toPageable() {
        Sort.Direction dir = Sort.Direction.fromString(direction.toUpperCase());
        return PageRequest.of(page, pageSize, Sort.by(dir, sortBy));
    }
}
