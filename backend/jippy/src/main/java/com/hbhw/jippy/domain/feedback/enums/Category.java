package com.hbhw.jippy.domain.feedback.enums;

import lombok.Getter;

@Getter
public enum Category {
    SERVICE("1"),  // 서비스 관련
    PRODUCT("2"), // 제품 관련
    ETC("3");     // 기타

    private final String value;

    Category(String value) {
        this.value = value;
    }

    // DB에서 가져온 string -> enum 변환
    public static Category fromValue(String value) {
        for (Category c : Category.values()) {
            if (c.getValue().equals(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Unknown category value: " + value);
    }
}
