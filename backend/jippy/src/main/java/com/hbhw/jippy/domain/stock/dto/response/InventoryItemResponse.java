package com.hbhw.jippy.domain.stock.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class InventoryItemResponse {
    @JsonProperty("stock_name")
    private String stockName;
    @JsonProperty("stock_total_value")
    private Integer stockTotalValue;
    @JsonProperty("updated_at")
    private String updatedAt;
    private List<StockDetailResponse> stock;
}
