package com.hbhw.jippy.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

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
     * 현재 날짜("yyyy-MM-dd") 문자열 반환
     */
    public static String todayString() {
        return LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    /**
     * 문자열을 LocalDateTime으로 변환
     */
    public static LocalDateTime parseDateTime(String dateTimestr) {
        return LocalDateTime.parse(dateTimestr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
    }

    /**
     * Jwt 생성 시간용 메서드
     */
    public static Date now() {
        return new Date();
    }

    /**
     * Jwt 만료 시간용 메서드
     */
    public static Date getExpirationTime(long expirationMillis) {
        return new Date(now().getTime() + expirationMillis);
    }

    /**
     * 원하는 시간/포맷에 대한 메서드를 더 만들 수도 있습니다
     */
}
