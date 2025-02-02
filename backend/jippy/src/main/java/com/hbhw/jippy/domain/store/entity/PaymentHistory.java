package com.hbhw.jippy.domain.store.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "payment_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistory {
    @Field("UUID")
    private String uuid;

    @Field("store_id")
    private Integer storeId;

    @Field("store_name")
    private String storeName;

    @Field("payment_at")
    private String paymentAt;

    @Field("total_price")
    private Integer totalPrice;

    /**
     * @Field("payment_type")
     * private PaymentType paymentType;
     */

    @Field("buy_product")
    private List<BuyProduct> buyProducts;
}
