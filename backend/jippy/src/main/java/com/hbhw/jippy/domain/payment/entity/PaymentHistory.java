package com.hbhw.jippy.domain.payment.entity;

import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.payment.enums.PaymentType;
import com.hbhw.jippy.utils.converter.PaymentStatusConverter;
import com.hbhw.jippy.utils.converter.PaymentTypeConverter;
import jakarta.persistence.Convert;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
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

    @Id
    @Indexed(unique = true)
    @Field("UUID")
    private String UUID;

    @Field("store_id")
    private Integer storeId;

    @Field("total_cost")
    private Integer totalCost;

    @Field("created_at")
    private String createdAt;

    @Field("payment_status")
    @Convert(converter = PaymentStatusConverter.class)
    private PaymentStatus paymentStatus;

    @Field("payment_type")
    @Convert(converter = PaymentTypeConverter.class)
    private PaymentType paymentType;

    @Field("buyProduct")
    private List<BuyProduct> buyProductHistories;

}
