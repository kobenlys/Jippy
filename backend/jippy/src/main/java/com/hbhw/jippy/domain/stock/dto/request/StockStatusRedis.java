package com.hbhw.jippy.domain.stock.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockStatusRedis {
    private Integer initialStock;
    private Integer soldStock;
    private Integer currentStock;
    private Integer soldPercentage;
    private String lastUpdated;
    private Boolean isDessert;
    private Boolean isLowStock;
}
