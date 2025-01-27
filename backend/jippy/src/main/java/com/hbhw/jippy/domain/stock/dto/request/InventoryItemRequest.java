package com.hbhw.jippy.domain.stock.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class InventoryItemRequest {
    @JsonProperty("stock_name")
    private String stockName;
    @JsonProperty("stock_total_value")
    private Integer stockTotalValue;
    @JsonProperty("updated_at")
    private String updatedAt;
    private List<StockDetailRequest> stock;
}
