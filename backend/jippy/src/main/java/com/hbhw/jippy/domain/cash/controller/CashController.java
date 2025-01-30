package com.hbhw.jippy.domain.cash.controller;

import com.hbhw.jippy.domain.cash.dto.request.CashRequest;
import com.hbhw.jippy.domain.cash.dto.response.CashResponse;
import com.hbhw.jippy.domain.cash.service.CashService;
import com.hbhw.jippy.global.response.ApiResponse;
import io.lettuce.core.dynamic.annotation.Param;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Cash", description = "시재 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cash/{storeId}/create")
public class CashController {

    private final CashService cashService;

    @Operation(summary = "시재 추가", description = "매장의 시재 정보를 추가합니다")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CashResponse> createCash(
            @Parameter(description = "매장 ID")
            @PathVariable Integer storeId,
            @RequestBody CashRequest request) {
        CashResponse response = cashService.createCash(storeId, request);
        return ApiResponse.success(HttpStatus.CREATED, response);
    }
}
