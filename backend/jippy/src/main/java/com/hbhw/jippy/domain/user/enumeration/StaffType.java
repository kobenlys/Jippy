package com.hbhw.jippy.domain.user.enumeration;

import lombok.Getter;

import java.util.Arrays;

@Getter
public enum StaffType {
    점주(1);

    private final Integer code;

    StaffType(Integer code) {
        this.code = code;
    }

    public static StaffType ofLegacyCode(Integer code) {
        return Arrays.stream(StaffType.values()).filter(type -> type.getCode().equals(code)).findFirst().orElseThrow(() -> new IllegalArgumentException("Invalid staff type code: " + code));
    }
}
