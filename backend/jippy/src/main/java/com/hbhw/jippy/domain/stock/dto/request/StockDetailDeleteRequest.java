package com.hbhw.jippy.domain.stock.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Schema(description = "재고 상세 삭제 요청")
@Getter
@Setter
@NoArgsConstructor
public class StockDetailDeleteRequest {

    @Schema(description = "재고별 크기", example = "100")
    @JsonProperty("stock_unit_size")
    private Integer stockUnitSize;

    @Schema(description = "재고 단위 크기", example = "g")
    @JsonProperty("stock_unit")
    private String stockUnit;
}
