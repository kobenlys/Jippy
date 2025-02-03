package com.hbhw.jippy.domain.stock.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Schema(description = "재고 상세 정보 응답")
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class StockDetailResponse {

    @Schema(description = "재고 수량", example = "3")
    @JsonProperty("stock_count")
    private Integer stockCount;

    @Schema(description = "재고별 크기", example = "100")
    @JsonProperty("stock_unit_size")
    private Integer stockUnitSize;

    @Schema(description = "재고 단위", example = "g")
    @JsonProperty("stock_unit")
    private String stockUnit;
}
