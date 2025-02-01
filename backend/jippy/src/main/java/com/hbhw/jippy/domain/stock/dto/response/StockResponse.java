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

@Schema(description = "재고 응답 DTO")
@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class StockResponse {

    @Schema(description = "매장 ID", example = "1")
    @JsonProperty("store_id")
    private Integer storeId;

    @ArraySchema(
            schema = @Schema(implementation = InventoryItemResponse.class)
    )
    private List<InventoryItemResponse> inventory;
}
