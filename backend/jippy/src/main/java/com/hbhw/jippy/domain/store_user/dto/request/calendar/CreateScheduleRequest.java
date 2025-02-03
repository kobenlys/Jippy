package com.hbhw.jippy.domain.store_user.dto.request.calendar;

import com.hbhw.jippy.domain.store_user.enums.DayOfWeek;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CreateScheduleRequest {
    private DayOfWeek dayOfWeek;
    private String startTime;  // HH:mm 형식
    private String endTime;    // HH:mm 형식
}
