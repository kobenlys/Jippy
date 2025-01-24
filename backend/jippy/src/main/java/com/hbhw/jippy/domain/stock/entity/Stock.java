package com.hbhw.jippy.domain.stock.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "stock")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Stock {
    @Id
    @Field("store_id")
    private int storeId;
    private List<InventoryItem> inventory;
}
