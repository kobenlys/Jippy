package com.hbhw.jippy.domain.feedback.entity;

import java.util.Arrays;

public enum Category {
    SERVICE("1"),  // 서비스 관련
    PRODUCT("2"),  // 제품 관련
    ETC("3");      // 기타

    private final String dbValue; // DB 컬럼에 저장될 실제 값

    Category(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    /**
     * DB에 저장된 문자열 코드로부터 Enum 객체를 찾는다.
     * 매칭이 안될 경우 기본값으로 ETC를 리턴하거나
     * 예외를 던지는 식으로 변경 가능.
     */
    public static Category fromDbValue(String dbValue) {
        return Arrays.stream(Category.values())
                .filter(c -> c.dbValue.equals(dbValue))
                .findFirst()
                .orElse(ETC);
    }
}