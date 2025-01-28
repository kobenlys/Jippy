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
public class StockResponse {

    @JsonProperty("store_id")
    private Integer storeId;
    private List<InventoryItemResponse> inventory;
}
