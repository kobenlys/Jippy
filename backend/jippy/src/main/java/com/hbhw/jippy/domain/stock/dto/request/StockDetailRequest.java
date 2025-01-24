package com.hbhw.jippy.domain.stock.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@NoArgsConstructor
public class StockDetailRequest {
    @JsonProperty("stock_count")
    private Integer stockCount;
    @JsonProperty("stock_unit_size")
    private Integer stockUnitSize;
    @JsonProperty("stock_unit")
    private String stockUnit;
}
