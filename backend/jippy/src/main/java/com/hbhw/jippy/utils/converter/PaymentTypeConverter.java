package com.hbhw.jippy.utils.converter;

import com.hbhw.jippy.domain.payment.enums.PaymentType;
import jakarta.persistence.AttributeConverter;

import java.util.Objects;

public class PaymentTypeConverter implements AttributeConverter<PaymentType, Integer> {

    @Override
    public Integer convertToDatabaseColumn(PaymentType paymentType) {
        if(!Objects.isNull(paymentType)){
            return paymentType.getCode();
        }
        throw new IllegalArgumentException();
    }

    @Override
    public PaymentType convertToEntityAttribute(Integer code) {
        if(!Objects.isNull(code)){
            return PaymentType.ofLegacyCode(code);
        }
        throw new IllegalArgumentException();
    }
}
