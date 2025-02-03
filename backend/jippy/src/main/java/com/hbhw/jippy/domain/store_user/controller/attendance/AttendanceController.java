package com.hbhw.jippy.domain.store_user.controller.attendance;

import com.hbhw.jippy.domain.store_user.dto.request.attendance.CheckInRequest;
import com.hbhw.jippy.domain.store_user.dto.response.attendance.CheckInResponse;
import com.hbhw.jippy.domain.store_user.dto.response.attendance.CheckOutResponse;
import com.hbhw.jippy.domain.store_user.service.attendance.AttendanceService;
import com.hbhw.jippy.global.auth.config.UserPrincipal;
import com.hbhw.jippy.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping("/checkIn")
    public ApiResponse<CheckInResponse> checkIn(@RequestBody CheckInRequest request, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CheckInResponse response = attendanceService.checkIn(request, userPrincipal.getId());
        return ApiResponse.success(response);
    }

    @PostMapping("/checkOut")
    public ApiResponse<CheckOutResponse> checkOut(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        CheckOutResponse response = attendanceService.checkOut(userPrincipal.getId());
        return ApiResponse.success(response);
    }
}
