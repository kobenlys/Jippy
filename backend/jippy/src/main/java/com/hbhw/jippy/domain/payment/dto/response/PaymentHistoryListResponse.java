package com.hbhw.jippy.domain.payment.dto.response;

import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.payment.enums.PaymentType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaymentHistoryListResponse {
    private String UUID;
    private String createdAt;
    private PaymentStatus paymentStatus;
    private PaymentType paymentType;
    private Integer totalCost;
}
