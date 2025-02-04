package com.hbhw.jippy.domain.payment.enums;

import lombok.Getter;

import java.util.Objects;

@Getter
public enum PaymentStatus {
    PURCHASE(1),
    CANCEL(2);

    private Integer code;

    PaymentStatus(Integer code) {
        this.code = code;
    }

    public static PaymentStatus ofLegacyCode(Integer code) {
        for (PaymentStatus stat : PaymentStatus.values()) {
            if (Objects.equals(code, stat.getCode())) {
                return stat;
            }
        }
        throw new IllegalArgumentException("Error!");
    }
}
