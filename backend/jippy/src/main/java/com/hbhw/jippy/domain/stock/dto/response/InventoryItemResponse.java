package com.hbhw.jippy.domain.stock.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Schema(description = "재고 인벤토리 응답")
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class InventoryItemResponse {

    @Schema(description = "재고 이름", example = "원두")
    @JsonProperty("stock_name")
    private String stockName;

    @Schema(description = "재고 총량", example = "300")
    @JsonProperty("stock_total_value")
    private Integer stockTotalValue;

    @Schema(description = "업데이트 시간", example = "2025-01-31 15:40:00")
    @JsonProperty("updated_at")
    private String updatedAt;

    @ArraySchema(
            schema = @Schema(implementation = StockDetailResponse.class)
    )
    private List<StockDetailResponse> stock;
}
