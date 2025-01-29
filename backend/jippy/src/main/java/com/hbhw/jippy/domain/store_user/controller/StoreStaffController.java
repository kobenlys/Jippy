package com.hbhw.jippy.domain.store_user.controller;

import com.hbhw.jippy.domain.store_user.dto.request.CreateStaffRequest;
import com.hbhw.jippy.domain.store_user.dto.response.StaffListResponse;
import com.hbhw.jippy.domain.store_user.service.StoreStaffService;
import com.hbhw.jippy.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storeUser")
@RequiredArgsConstructor
public class StoreStaffController {
    private final StoreStaffService storeStaffService;

    @Operation(summary = "매장 직원 등록", description = "매장에 직원을 등록합니다")
    @PostMapping("/{storeId}/create/staff")
    public ApiResponse<?> createStaff(@PathVariable Integer storeId, @Valid @RequestBody CreateStaffRequest request) {
        storeStaffService.createStaff(storeId, request);
        return ApiResponse.success(HttpStatus.CREATED);
    }

    @Operation(summary = "매장 직원 목록 조회", description = "매장의 모든 직원 목록을 조회합니다")
    @GetMapping("/{storeId}/select/staff")
    public ApiResponse<List<StaffListResponse>> getStaffList(@PathVariable Integer storeId) {
        List<StaffListResponse> staffList = storeStaffService.getStaffList(storeId);
        return ApiResponse.success(staffList);
    }

    @Operation(summary = "매니저 등록", description = "매장에 등록된 직원을 매니저로 지정합니다")
    @PutMapping("/{storeId}/update/staff/{staffId}")
    public ApiResponse<?> updateStaffInfo(@PathVariable Integer storeId, @PathVariable Integer staffId) {
        storeStaffService.updateStaffInfo(storeId, staffId);
        return ApiResponse.success(HttpStatus.OK);
    }

    @Operation(summary = "매장 직원 삭제", description = "매장에서 직원을 삭제합니다.")
    @DeleteMapping("/{storeId}/delete/staff/{staffId}")
    public ApiResponse<?> deleteStaff(@PathVariable Integer storeId, @PathVariable Integer staffId) {
        storeStaffService.deleteStaff(storeId, staffId);
        return ApiResponse.success(HttpStatus.NO_CONTENT);
    }
}
