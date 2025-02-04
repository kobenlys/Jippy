package com.hbhw.jippy.domain.store_user.dto.request.calendar;

import com.hbhw.jippy.domain.store_user.enums.DayOfWeek;
import lombok.*;

@Getter
@Builder
public class DayScheduleRequest {
    private DayOfWeek dayOfWeek;
    private String startTime;
    private String endTime;
}
