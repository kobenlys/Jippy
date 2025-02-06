package com.hbhw.jippy.domain.storeuser.controller.attendance;

import com.hbhw.jippy.domain.storeuser.dto.request.attendance.CheckInRequest;
import com.hbhw.jippy.domain.storeuser.dto.response.attendance.CheckInResponse;
import com.hbhw.jippy.domain.storeuser.dto.response.attendance.CheckOutResponse;
import com.hbhw.jippy.domain.storeuser.service.attendance.AttendanceService;
import com.hbhw.jippy.global.auth.config.UserPrincipal;
import com.hbhw.jippy.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Attendance", description = "직원 근태 관리 API")
@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @Operation(summary = "직원 출근", description = "직원의 출근 기록을 등록합니다")
    @PostMapping("/{storeId}/checkIn")
    public ApiResponse<CheckInResponse> checkIn(@PathVariable Integer storeId, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CheckInResponse response = attendanceService.checkIn(storeId, userPrincipal.getId());
        return ApiResponse.success(response);
    }

    @Operation(summary = "직원 퇴근", description = "직원의 퇴근 기록을 등록합니다")
    @PutMapping("/checkOut")
    public ApiResponse<CheckOutResponse> checkOut(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        CheckOutResponse response = attendanceService.checkOut(userPrincipal.getId());
        return ApiResponse.success(response);
    }
}
