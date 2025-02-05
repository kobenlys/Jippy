package com.hbhw.jippy.domain.notice.controller;

import com.hbhw.jippy.domain.notice.dto.request.NoticeRequest;
import com.hbhw.jippy.domain.notice.dto.response.NoticeResponse;
import com.hbhw.jippy.domain.notice.service.NoticeService;
import com.hbhw.jippy.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Notice", description = "공지사항 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notice/{storeId}")
public class NoticeController {

    private final NoticeService noticeService;

    @Operation(summary = "공지사항 생성", description = "매장의 공지사항을 생성합니다")
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<NoticeResponse> createNotice(
            @Parameter(description = "매장 ID")
            @PathVariable Integer storeId,
            @RequestBody NoticeRequest request) {
        NoticeResponse response = noticeService.createNotice(storeId, request);
        return ApiResponse.success(HttpStatus.CREATED, response);
    }
}
