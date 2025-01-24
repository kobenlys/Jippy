package com.hbhw.jippy.domain.stock.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class StockDetailResponse {
    @JsonProperty("stock_count")
    private Integer stockCount;
    @JsonProperty("stock_unit_size")
    private Integer stockUnitSize;
    @JsonProperty("stock_unit")
    private String stockUnit;
}
