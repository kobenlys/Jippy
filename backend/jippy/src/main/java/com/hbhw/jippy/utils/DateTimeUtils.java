package com.hbhw.jippy.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtils {

    /**
     *  유틸 클래스이므로 인스턴스 생성 방지
     */
    private DateTimeUtils() {
    }

    /**
     * 현재 시간("yyyy-MM-dd HH:mm:ss") 문자열 반환
     */
    public static String nowString() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    /**
     * 원하는 시간/포맷에 대한 메서드를 더 만들 수도 있습니다
     */
}
