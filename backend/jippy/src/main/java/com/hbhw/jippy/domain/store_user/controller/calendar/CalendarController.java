package com.hbhw.jippy.domain.store_user.controller.calendar;

import com.hbhw.jippy.domain.store_user.dto.request.calendar.CreateScheduleRequest;
import com.hbhw.jippy.domain.store_user.service.calendar.CalendarService;
import com.hbhw.jippy.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {
    private final CalendarService calendarService;

    @PostMapping("/{storeId}/create/{staffId}")
    public ApiResponse<?> createSchedule(@PathVariable Integer storeId, @PathVariable Integer staffId, @RequestBody CreateScheduleRequest request) {
        calendarService.createSchedule(storeId, staffId, request);
        return ApiResponse.success(HttpStatus.CREATED);
    }
}
