package com.hbhw.jippy.domain.payment.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyProduct {
    @Field("product_id")
    private Integer productId;

    @Field("product_category")
    private Integer productCategory;

    @Field("product_quantity")
    private Integer productQuantity;

    @Field("price")
    private Integer price;
}
