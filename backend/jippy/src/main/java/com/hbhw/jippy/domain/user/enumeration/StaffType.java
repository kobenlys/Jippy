package com.hbhw.jippy.domain.user.enumeration;

import lombok.Getter;

import java.util.Objects;

@Getter
public enum StaffType {
    점주(1);

    private final Integer code;

    StaffType(Integer code) {
        this.code = code;
    }

    public static StaffType ofLegacyCode(Integer code) {
        for (StaffType type : StaffType.values()) {
            if (Objects.equals(code, type.getCode())) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid staff type code: " + code);
    }
}
