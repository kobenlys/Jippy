package com.hbhw.jippy.domain.notice.controller;

import com.hbhw.jippy.domain.notice.dto.request.NoticeRequest;
import com.hbhw.jippy.domain.notice.dto.response.NoticeResponse;
import com.hbhw.jippy.domain.notice.entity.Notice;
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

    @Operation(summary = "공지사항 단일 조회", description = "매장의 특정 공지사항을 조회합니다")
    @GetMapping("/select/{id}")
    public ApiResponse<NoticeResponse> getNotice(
            @Parameter(description = "매장 ID")
            @PathVariable Integer storeId,
            @Parameter(description = "공지사항 ID")
            @PathVariable Long id) {
        NoticeResponse response = noticeService.getNotice(storeId, id);
        return ApiResponse.success(HttpStatus.OK, response);
    }

//    @Operation(summary = "공지사항 수정", description = "매장의 공지사항을 수정합니다")
//    @PutMapping("/update/{noticeId}")
//    @ResponseStatus(HttpStatus.OK)
//    public ApiResponse<NoticeResponse> updateNotice(
//            @Parameter(description = "매장 ID")
//            @PathVariable Integer storeId,
//            @Parameter(description = "공지사항 ID")
//            @PathVariable Long noticeId,
//            @RequestBody NoticeRequest request) {
//        NoticeResponse response = noticeService.updateNotice(storeId, noticeId, request);
//        return ApiResponse.success(HttpStatus.OK, response);
//    }
}
