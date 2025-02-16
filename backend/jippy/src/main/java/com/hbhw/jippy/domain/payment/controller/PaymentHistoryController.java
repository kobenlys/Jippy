package com.hbhw.jippy.domain.payment.controller;


import com.hbhw.jippy.domain.payment.dto.request.PaymentUUIDRequest;
import com.hbhw.jippy.domain.payment.dto.response.*;
import com.hbhw.jippy.domain.payment.entity.BuyProduct;
import com.hbhw.jippy.domain.payment.entity.PaymentHistory;
import com.hbhw.jippy.domain.payment.enums.PaymentStatus;
import com.hbhw.jippy.domain.payment.enums.PaymentType;
import com.hbhw.jippy.domain.payment.service.PaymentHistoryService;
import com.hbhw.jippy.global.response.ApiResponse;
import com.hbhw.jippy.utils.DateTimeUtils;
import com.hbhw.jippy.utils.UUIDProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/payment-history")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;
    private final UUIDProvider uuidProvider;

    /**
     * 결제 후 결제 내역 저장하는 테스트 API
     * 결제 도메인 완성 전까지 사용하시면 됩니다.
     */
    @PostMapping("/add")
    public ApiResponse<?> addTestPaymentHistory(@RequestParam("storeId") Integer storeId) {

        // 덤프 데이터 (삭제 예정)
        BuyProduct buyProduct1 = BuyProduct.builder()
                .productId(1L)
                .productCategoryId(101)
                .productQuantity(2)
                .price(1000)
                .build();

        BuyProduct buyProduct2 = BuyProduct.builder()
                .productId(2L)
                .productCategoryId(102)
                .productQuantity(1)
                .price(500)
                .build();

        List<BuyProduct> buyProductHistories = new ArrayList<>();
        buyProductHistories.add(buyProduct1);
        buyProductHistories.add(buyProduct2);

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .UUID(uuidProvider.generateUUID())  // 예시 UUID
                .storeId(storeId)  // 예시 storeId
                .paymentStatus(PaymentStatus.PURCHASE.getDescription())
                .paymentType(PaymentType.QRCODE.getDescription())
                .updatedAt(DateTimeUtils.nowString())
                .buyProductHistories(buyProductHistories)
                .totalCost(250000)
                .build();
        paymentHistoryService.savePaymentHistory(paymentHistory);
        return ApiResponse.success(HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ApiResponse<List<PaymentHistoryListResponse>> getAllPaymentHistory(@RequestParam("storeId") Integer storeId) {
        List<PaymentHistoryListResponse> paymentHistoryListResponses = paymentHistoryService.getPaymentHistoryList(storeId);
        return ApiResponse.success(HttpStatus.OK, paymentHistoryListResponses);
    }

    @PutMapping("/change/status")
    public ApiResponse<?> changeStatusPaymentHistory(@RequestBody PaymentUUIDRequest paymentUUIDRequest) {
        paymentHistoryService.changeStatusPaymentHistory(paymentUUIDRequest);
        return ApiResponse.success(HttpStatus.OK);
    }

    @PutMapping("/change/type")
    public ApiResponse<?> changeTypePaymentHistory(@RequestBody PaymentUUIDRequest paymentUUIDRequest) {
        paymentHistoryService.changeTypePaymentHistory(paymentUUIDRequest);
        return ApiResponse.success(HttpStatus.OK);
    }

    @PostMapping("/detail")
    public ApiResponse<PaymentDetailResponse> getDetailPaymentHistory(@RequestBody PaymentUUIDRequest paymentUUIDRequest) {
        PaymentDetailResponse paymentDetailResponse = paymentHistoryService.selectDetailPaymentHistory(paymentUUIDRequest);
        return ApiResponse.success(HttpStatus.OK, paymentDetailResponse);
    }

    @GetMapping("/list/success")
    public ApiResponse<List<PaymentHistoryListResponse>> getSuccessHistoryList(@RequestParam("storeId") Integer storeId) {
        List<PaymentHistoryListResponse> paymentHistoryListResponses = paymentHistoryService.getSuccessHistoryList(storeId);
        return ApiResponse.success(HttpStatus.OK, paymentHistoryListResponses);
    }

    @GetMapping("/list/cancel")
    public ApiResponse<List<PaymentHistoryListResponse>> getCancelHistoryList(@RequestParam("storeId") Integer storeId) {
        List<PaymentHistoryListResponse> paymentHistoryListResponses = paymentHistoryService.getCancelHistoryList(storeId);
        return ApiResponse.success(HttpStatus.OK, paymentHistoryListResponses);
    }

    @GetMapping("/sales/day")
    public ApiResponse<SalesByDayResponse> fetchSalesByDay(@RequestParam("storeId") Integer storeId, @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate ) {
        SalesByDayResponse salesByDayResponse = paymentHistoryService.fetchSalesByDay(storeId, startDate, endDate);
        return ApiResponse.success(HttpStatus.OK, salesByDayResponse);
    }

    @GetMapping("/sales/week")
    public ApiResponse<SalesByWeekResponse> fetchSalesByWeek(@RequestParam("storeId") Integer storeId, @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate ) {
        SalesByWeekResponse salesByWeekResponse = paymentHistoryService.fetchSalesByWeek(storeId, startDate, endDate);
        return ApiResponse.success(HttpStatus.OK, salesByWeekResponse);
    }

    @GetMapping("/sales/month")
    public ApiResponse<SalesByMonthResponse> fetchSalesByMonth(@RequestParam("storeId") Integer storeId, @RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate ) {
        SalesByMonthResponse salesByMonthResponse = paymentHistoryService.fetchSalesByMonth(storeId, startDate, endDate);
        return ApiResponse.success(HttpStatus.OK, salesByMonthResponse);
    }
}
