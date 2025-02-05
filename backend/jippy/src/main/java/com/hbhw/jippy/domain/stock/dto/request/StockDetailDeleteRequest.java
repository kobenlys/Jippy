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

    @Schema(description = "삭제 이유 확인용(폐기할 경우만 이외에는 삭제 가능, true일 때만 폐기)", example = "true")
    private Boolean isDisposal;
}
