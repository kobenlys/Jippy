package com.hbhw.jippy.utils.converter;

import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.product.enums.ProductSize;
import jakarta.persistence.AttributeConverter;

import java.util.Objects;

public class PaymentStatusConverter implements AttributeConverter<PaymentStatus, Integer> {

    @Override
    public Integer convertToDatabaseColumn(PaymentStatus paymentStatus) {
        if(!Objects.isNull(paymentStatus)){
            return paymentStatus.getCode();
        }
        throw new IllegalArgumentException();
    }

    @Override
    public PaymentStatus convertToEntityAttribute(Integer code) {
        if(!Objects.isNull(code)){
            return PaymentStatus.ofLegacyCode(code);
        }
        throw new IllegalArgumentException();
    }
}
