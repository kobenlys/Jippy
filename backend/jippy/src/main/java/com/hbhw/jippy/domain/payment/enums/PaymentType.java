package com.hbhw.jippy.domain.payment.enums;

import com.hbhw.jippy.domain.product.enums.ProductSize;
import lombok.Getter;

import java.util.Objects;

@Getter
public enum PaymentType {
    QRCODE(1),
    CASH(2);

    private Integer code;

    PaymentType(Integer code) {
        this.code = code;
    }

    public static PaymentType ofLegacyCode(Integer code) {
        for (PaymentType stat : PaymentType.values()) {
            if (Objects.equals(code, stat.getCode())) {
                return stat;
            }
        }
        throw new IllegalArgumentException("Error!");
    }

}
